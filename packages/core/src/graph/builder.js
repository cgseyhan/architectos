const fs = require('fs');
const path = require('path');
const { NodeType, EdgeType } = require('../types');
const { scanCodeForVulnerabilities } = require('../security/sastScanner');

/**
 * ArchitectOS Multi-Source Graph Builder
 * Unifies AST parsing (Tree-sitter pattern), dependency graph extraction (Graphify pattern),
 * cycle detection (Madge pattern), and rule validation (Dependency Cruiser pattern).
 */
class GraphBuilder {
  constructor(targetDir, config) {
    this.targetDir = targetDir;
    this.config = config;
    this.nodes = new Map();
    this.edges = [];
    this.cycles = [];
    this.violations = [];
  }

  scan() {
    this.nodes.clear();
    this.edges = [];
    this.cycles = [];
    this.violations = [];

    const files = this.collectFiles(this.targetDir);
    
    const cacheFile = path.join(this.targetDir, '.architectos', 'cache.json');
    let cache = {};
    if (fs.existsSync(cacheFile)) {
      try { cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8')); } catch (e) {}
    }
    const newCache = {};

    // Step 1: Create File & Symbol Nodes (Incremental Indexing)
    for (const relFile of files) {
      const fullPath = path.join(this.targetDir, relFile);
      let stat = null;
      try {
        if (fs.existsSync(fullPath)) stat = fs.statSync(fullPath);
      } catch (e) { continue; }

      if (!stat) continue;
      const nodeId = relFile.replace(/\\/g, '/');
      const cachedEntry = cache[nodeId];

      if (cachedEntry && cachedEntry.mtimeMs === stat.mtimeMs && cachedEntry.node) {
        this.nodes.set(nodeId, cachedEntry.node);
        newCache[nodeId] = cachedEntry;
        continue;
      }

      let content = '';
      try { content = fs.readFileSync(fullPath, 'utf-8'); } catch (e) { continue; }

      const domainTag = this.inferDomainTag(relFile);
      const node = {
        id: nodeId,
        name: path.basename(relFile),
        path: relFile,
        type: NodeType.FILE,
        domain: domainTag,
        size: content.length,
        lines: content.split('\n').length,
        symbols: this.extractSymbols(content, relFile),
        vulnerabilities: scanCodeForVulnerabilities(content, relFile)
      };

      this.nodes.set(nodeId, node);
      newCache[nodeId] = { mtimeMs: stat.mtimeMs, node };
    }

    try {
      const archDir = path.join(this.targetDir, '.architectos');
      if (!fs.existsSync(archDir)) fs.mkdirSync(archDir, { recursive: true });
      fs.writeFileSync(cacheFile, JSON.stringify(newCache, null, 2));
    } catch (e) {}

    // Step 2: Extract Dependency Edges (Imports/Requires)
    for (const [nodeId, node] of this.nodes.entries()) {
      const fullPath = path.join(this.targetDir, node.path);
      let content = '';
      try {
        if (fs.existsSync(fullPath)) content = fs.readFileSync(fullPath, 'utf-8');
      } catch (e) { continue; }

      const importedPaths = this.extractImports(content, node.path);

      for (const item of importedPaths) {
        const importStr = typeof item === 'string' ? item : item.path;
        const importKind = typeof item === 'string' ? 'RUNTIME' : (item.kind || 'RUNTIME');
        const resolvedTarget = this.resolveImport(node.path, importStr);
        if (resolvedTarget && this.nodes.has(resolvedTarget)) {
          this.edges.push({
            id: `${nodeId}->${resolvedTarget}`,
            source: nodeId,
            target: resolvedTarget,
            type: EdgeType.IMPORTS,
            kind: importKind
          });
        }
      }
    }

    // Step 3: Detect Circular Dependencies (Madge engine pattern)
    this.cycles = this.detectCycles();

    // Step 4: Validate Architectural Boundaries (Dependency Cruiser rule pattern)
    this.violations = this.validateRules();

    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
      cycles: this.cycles,
      violations: this.violations,
      stats: {
        totalFiles: this.nodes.size,
        totalDependencies: this.edges.length,
        totalCycles: this.cycles.length,
        totalViolations: this.violations.length
      }
    };
  }

  collectFiles(dir, fileList = [], depth = 0) {
    if (depth > 8) return fileList;
    const excludes = (this.config && this.config.exclude) || [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const lowerName = entry.name.toLowerCase();
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(this.targetDir, fullPath).replace(/\\/g, '/');

        const isExcluded = excludes.some(pattern => {
          const cleanPattern = pattern.replace(/\*/g, '').replace(/^\/+|\/+$/g, '');
          return cleanPattern && relPath.includes(cleanPattern);
        });

        if (
          lowerName.startsWith('.') || 
          lowerName === 'node_modules' || 
          lowerName === 'dist' || 
          lowerName === 'build' || 
          lowerName === 'scratch' || 
          lowerName === 'tmp' || 
          lowerName === 'pytest-tmp' ||
          lowerName === 'venv' ||
          lowerName === '.venv' ||
          lowerName === 'env' ||
          relPath.includes('packages/cli/lib') ||
          relPath.includes('packages\\cli\\lib') ||
          isExcluded
        ) {
          continue;
        }

        if (entry.isDirectory()) {
          this.collectFiles(fullPath, fileList, depth + 1);
        } else if (/\.(js|jsx|ts|tsx|py|json)$/.test(entry.name)) {
          const rel = path.relative(this.targetDir, fullPath);
          fileList.push(rel);
        }
      }
    } catch (e) {
      // Gracefully skip directories with permission errors
    }
    return fileList;
  }

  inferDomainTag(filePath) {
    const norm = filePath.toLowerCase();
    if (norm.includes('ui') || norm.includes('component') || norm.includes('view') || norm.includes('page')) return 'UI/Presentation';
    if (norm.includes('api') || norm.includes('route') || norm.includes('controller')) return 'API/Controller';
    if (norm.includes('auth') || norm.includes('security')) return 'Security/Auth';
    if (norm.includes('db') || norm.includes('schema') || norm.includes('prisma') || norm.includes('repository')) return 'Infrastructure/Database';
    if (norm.includes('service') || norm.includes('domain') || norm.includes('usecase')) return 'Domain/BusinessLogic';
    return 'Core/Utility';
  }

  extractSymbols(content, filePath) {
    const symbols = [];
    try {
      const isPython = filePath.endsWith('.py');
      if (isPython) {
        const pyClasses = content.matchAll(/^class\s+([A-Za-z0-9_]+)/gm);
        for (const match of pyClasses) symbols.push({ name: match[1], kind: 'class', exported: true });

        const pyFunctions = content.matchAll(/^(?:async\s+)?def\s+([A-Za-z0-9_]+)/gm);
        for (const match of pyFunctions) symbols.push({ name: match[1], kind: 'function', exported: true });
      } else {
        const classMatches = content.matchAll(/export\s+(?:default\s+)?class\s+([A-Za-z0-9_]+)/g);
        for (const match of classMatches) symbols.push({ name: match[1], kind: 'class', exported: true });

        const fnMatches = content.matchAll(/export\s+(?:default\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)?/g);
        for (const match of fnMatches) {
          if (match[1]) symbols.push({ name: match[1], kind: 'function', exported: true });
        }

        const interfaceMatches = content.matchAll(/export\s+interface\s+([A-Za-z0-9_]+)/g);
        for (const match of interfaceMatches) symbols.push({ name: match[1], kind: 'interface', exported: true });

        const typeMatches = content.matchAll(/export\s+type\s+([A-Za-z0-9_]+)/g);
        for (const match of typeMatches) symbols.push({ name: match[1], kind: 'type', exported: true });

        const varMatches = content.matchAll(/export\s+(?:const|let|var)\s+([A-Za-z0-9_]+)/g);
        for (const match of varMatches) symbols.push({ name: match[1], kind: 'variable', exported: true });

        if (/export\s+default/.test(content)) symbols.push({ name: 'default', kind: 'export', exported: true });
        if (/module\.exports/.test(content)) symbols.push({ name: 'exports', kind: 'export', exported: true });
      }
    } catch (e) {}
    return symbols;
  }

  extractImports(content, relFile) {
    try {
      const PolyglotResolver = require('./polyglot');
      return PolyglotResolver.extractImports(content, relFile);
    } catch (e) {
      return [];
    }
  }

  loadPathAliases() {
    if (this.pathAliases) return this.pathAliases;
    this.pathAliases = [];
    const tsconfigPath = path.join(this.targetDir, 'tsconfig.json');
    const jsconfigPath = path.join(this.targetDir, 'jsconfig.json');
    const targetFile = fs.existsSync(tsconfigPath) ? tsconfigPath : (fs.existsSync(jsconfigPath) ? jsconfigPath : null);

    if (targetFile) {
      try {
        const raw = fs.readFileSync(targetFile, 'utf-8');
        // Strip JSON comments
        const clean = raw.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        const json = JSON.parse(clean);
        const paths = (json.compilerOptions && json.compilerOptions.paths) || {};
        for (const aliasPattern of Object.keys(paths)) {
          const aliasPrefix = aliasPattern.replace(/\*$/, '');
          const targets = paths[aliasPattern] || [];
          if (targets.length > 0) {
            const targetPrefix = targets[0].replace(/\*$/, '');
            this.pathAliases.push({ aliasPrefix, targetPrefix });
          }
        }
      } catch (e) {}
    }
    return this.pathAliases;
  }

  resolveImport(sourceFile, importPath) {
    let resolvedImport = importPath;
    const aliases = this.loadPathAliases();

    for (const { aliasPrefix, targetPrefix } of aliases) {
      if (importPath.startsWith(aliasPrefix)) {
        resolvedImport = importPath.replace(aliasPrefix, targetPrefix);
        break;
      }
    }

    // Default alias fallback: '@/' -> 'src/' or 'app/'
    if (importPath.startsWith('@/') || importPath.startsWith('~/')) {
      resolvedImport = importPath.replace(/^[@~]\//, 'src/');
    }

    const sourceDir = path.dirname(path.join(this.targetDir, sourceFile));
    const targetAbs = path.isAbsolute(resolvedImport) ? resolvedImport : path.resolve(sourceDir, resolvedImport);
    const relTarget = path.relative(this.targetDir, targetAbs).replace(/\\/g, '/');

    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.json', '/index.ts', '/index.js'];
    for (const ext of extensions) {
      const cand = relTarget + ext;
      if (this.nodes.has(cand)) return cand;
      // Direct relative match
      const rawCand = resolvedImport.replace(/\\/g, '/') + ext;
      if (this.nodes.has(rawCand)) return rawCand;
    }
    return null;
  }

  detectCycles() {
    const cycles = [];
    const indexMap = new Map();
    const lowLinkMap = new Map();
    const onStack = new Set();
    const stack = [];
    let index = 0;

    const adj = new Map();
    for (const edge of this.edges) {
      if (!adj.has(edge.source)) adj.set(edge.source, []);
      adj.get(edge.source).push(edge.target);
    }

    const strongConnect = (v) => {
      indexMap.set(v, index);
      lowLinkMap.set(v, index);
      index++;
      stack.push(v);
      onStack.add(v);

      const neighbors = adj.get(v) || [];
      for (const w of neighbors) {
        if (!indexMap.has(w)) {
          strongConnect(w);
          lowLinkMap.set(v, Math.min(lowLinkMap.get(v), lowLinkMap.get(w)));
        } else if (onStack.has(w)) {
          lowLinkMap.set(v, Math.min(lowLinkMap.get(v), indexMap.get(w)));
        }
      }

      if (lowLinkMap.get(v) === indexMap.get(v)) {
        const scc = [];
        let w;
        do {
          w = stack.pop();
          onStack.delete(w);
          scc.push(w);
        } while (w !== v);

        if (scc.length > 1) {
          cycles.push(scc);
        }
      }
    };

    for (const node of this.nodes.keys()) {
      if (!indexMap.has(node)) {
        strongConnect(node);
      }
    }
    return cycles;
  }

  validateRules() {
    const violations = [];
    const rules = (this.config.architecture && this.config.architecture.rules) || [];

    for (const rule of rules) {
      if (rule.type === 'no-cycles' && this.cycles.length > 0) {
        violations.push({
          ruleId: rule.id || 'no-cycles',
          ruleName: rule.name || 'No Circular Import Cycles',
          severity: 'ERROR',
          message: `Found ${this.cycles.length} circular dependency cycle(s).`,
          details: this.cycles
        });
      }
      if (rule.from && rule.disallowImport) {
        for (const edge of this.edges) {
          const sourceNode = this.nodes.get(edge.source);
          const targetNode = this.nodes.get(edge.target);
          if (!sourceNode || !targetNode) continue;

          const sourceInDomain = sourceNode.domain.toLowerCase().includes(rule.from.toLowerCase());
          const targetDisallowed = rule.disallowImport.some(d => targetNode.domain.toLowerCase().includes(d.toLowerCase()));

          if (sourceInDomain && targetDisallowed) {
            violations.push({
              ruleId: rule.id,
              ruleName: rule.name,
              severity: 'ERROR',
              message: `Architectural Constitution Violation: ${edge.source} (${sourceNode.domain}) imports disallowed ${edge.target} (${targetNode.domain})`,
              source: edge.source,
              target: edge.target
            });
          }
        }
      }
    }
    return violations;
  }
}

module.exports = GraphBuilder;
module.exports.GraphBuilder = GraphBuilder;

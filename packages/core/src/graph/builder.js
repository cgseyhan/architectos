const fs = require('fs');
const path = require('path');
const { NodeType, EdgeType } = require('../types');

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
    
    // Step 1: Create File & Symbol Nodes
    for (const relFile of files) {
      const fullPath = path.join(this.targetDir, relFile);
      let content = '';
      try {
        if (fs.existsSync(fullPath)) content = fs.readFileSync(fullPath, 'utf-8');
      } catch (e) { continue; }

      const domainTag = this.inferDomainTag(relFile);
      const nodeId = relFile.replace(/\\/g, '/');
      const node = {
        id: nodeId,
        name: path.basename(relFile),
        path: relFile,
        type: NodeType.FILE,
        domain: domainTag,
        size: content.length,
        lines: content.split('\n').length,
        symbols: this.extractSymbols(content, relFile)
      };

      this.nodes.set(nodeId, node);
    }

    // Step 2: Extract Dependency Edges (Imports/Requires)
    for (const [nodeId, node] of this.nodes.entries()) {
      const fullPath = path.join(this.targetDir, node.path);
      let content = '';
      try {
        if (fs.existsSync(fullPath)) content = fs.readFileSync(fullPath, 'utf-8');
      } catch (e) { continue; }

      const importedPaths = this.extractImports(content, node.path);

      for (const targetPath of importedPaths) {
        const resolvedTarget = this.resolveImport(node.path, targetPath);
        if (resolvedTarget && this.nodes.has(resolvedTarget)) {
          this.edges.push({
            id: `${nodeId}->${resolvedTarget}`,
            source: nodeId,
            target: resolvedTarget,
            type: EdgeType.IMPORTS
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
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const lowerName = entry.name.toLowerCase();
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
          lowerName === 'architectos-out'
        ) {
          continue;
        }

        const fullPath = path.join(dir, entry.name);
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
      const classMatches = content.matchAll(/(?:export\s+)?class\s+([A-Za-z0-9_]+)/g);
      for (const match of classMatches) {
        symbols.push({ name: match[1], kind: 'class' });
      }
      const fnMatches = content.matchAll(/(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)/g);
      for (const match of fnMatches) {
        symbols.push({ name: match[1], kind: 'function' });
      }
      const interfaceMatches = content.matchAll(/(?:export\s+)?interface\s+([A-Za-z0-9_]+)/g);
      for (const match of interfaceMatches) {
        symbols.push({ name: match[1], kind: 'interface' });
      }
      const varMatches = content.matchAll(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_]+)/g);
      for (const match of varMatches) {
        symbols.push({ name: match[1], kind: 'variable' });
      }
      if (/module\.exports/.test(content)) {
        symbols.push({ name: 'exports', kind: 'export' });
      }
    } catch (e) {}
    return symbols;
  }

  extractImports(content, filePath) {
    const imports = new Set();
    try {
      const importRegex = /(?:import\s+.*?from\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const imp = match[1] || match[2];
        if (imp && (imp.startsWith('.') || imp.startsWith('/'))) {
          imports.add(imp);
        }
      }
      const pyRegex = /(?:from\s+([^\s]+)\s+import|import\s+([^\s]+))/g;
      while ((match = pyRegex.exec(content)) !== null) {
        const pyImp = match[1] || match[2];
        if (pyImp && pyImp.startsWith('.')) {
          imports.add(pyImp);
        }
      }
    } catch (e) {}
    return Array.from(imports);
  }

  resolveImport(sourceFile, importPath) {
    const sourceDir = path.dirname(path.join(this.targetDir, sourceFile));
    const targetAbs = path.resolve(sourceDir, importPath);
    const relTarget = path.relative(this.targetDir, targetAbs).replace(/\\/g, '/');

    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.json', '/index.ts', '/index.js'];
    for (const ext of extensions) {
      const cand = relTarget + ext;
      if (this.nodes.has(cand)) return cand;
    }
    return null;
  }

  detectCycles() {
    const cycles = [];
    const visited = new Set();
    const stack = new Set();
    const adj = new Map();

    for (const edge of this.edges) {
      if (!adj.has(edge.source)) adj.set(edge.source, []);
      adj.get(edge.source).push(edge.target);
    }

    const dfs = (curr, pathArr) => {
      visited.add(curr);
      stack.add(curr);
      pathArr.push(curr);

      const neighbors = adj.get(curr) || [];
      for (const nxt of neighbors) {
        if (!visited.has(nxt)) {
          dfs(nxt, [...pathArr]);
        } else if (stack.has(nxt)) {
          const cyclePath = pathArr.slice(pathArr.indexOf(nxt));
          cycles.push(cyclePath);
        }
      }
      stack.delete(curr);
    };

    for (const node of this.nodes.keys()) {
      if (!visited.has(node)) {
        dfs(node, []);
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

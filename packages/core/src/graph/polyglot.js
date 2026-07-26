/**
 * ArchitectOS Polyglot Language Resolvers
 * Extracts import dependency boundaries for Python (.py), Go (.go), Rust (.rs), and TS/JS (.ts, .js).
 */

class PolyglotResolver {
  static extractImports(content, filePath) {
    const ext = (filePath.substring(filePath.lastIndexOf('.')) || '').toLowerCase();
    
    if (ext === '.py') {
      return PolyglotResolver.extractPythonImports(content);
    }
    if (ext === '.go') {
      return PolyglotResolver.extractGoImports(content);
    }
    if (ext === '.rs') {
      return PolyglotResolver.extractRustImports(content);
    }

    return PolyglotResolver.extractJsTsImports(content);
  }

  static extractPythonImports(content) {
    const imports = [];
    const importRegex = /^\s*import\s+([a-zA-Z0-9_\.,\s]+)/gm;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const parts = match[1].split(',');
      for (const p of parts) {
        const clean = p.trim().split(/\s+/)[0];
        if (clean && !clean.startsWith('.')) imports.push(clean.replace(/\./g, '/'));
      }
    }

    const fromRegex = /^\s*from\s+([a-zA-Z0-9_\.]+)\s+import/gm;
    while ((match = fromRegex.exec(content)) !== null) {
      const clean = match[1].trim().replace(/\./g, '/');
      if (clean) imports.push(clean);
    }

    return imports;
  }

  static extractGoImports(content) {
    const imports = [];
    const goSingleRegex = /^\s*import\s+"([^"]+)"/gm;
    let match;
    while ((match = goSingleRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    const goBlockRegex = /import\s*\(([\s\S]*?)\)/g;
    while ((match = goBlockRegex.exec(content)) !== null) {
      const lines = match[1].split('\n');
      for (const line of lines) {
        const lineMatch = /"([^"]+)"/.exec(line);
        if (lineMatch) imports.push(lineMatch[1]);
      }
    }

    return imports;
  }

  static extractRustImports(content) {
    const imports = [];
    const rustRegex = /^\s*use\s+([a-zA-Z0-9_:]+);/gm;
    let match;
    while ((match = rustRegex.exec(content)) !== null) {
      const path = match[1].replace(/::/g, '/');
      imports.push(path);
    }
    return imports;
  }

  static extractJsTsImports(content) {
    const imports = [];
    const importRegex = /(?:import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]|require\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const imp = match[1] || match[2] || match[3];
      if (imp) imports.push(imp);
    }
    return imports;
  }
}

module.exports = PolyglotResolver;

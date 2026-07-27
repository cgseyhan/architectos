/**
 * ArchitectOS Zombie Export Detector
 * Identifies exported symbols with 0 external references across the repository,
 * incorporating a robust Framework Entrypoint Whitelist (Next.js, Remix, Vitest, Express).
 */
function detectZombieExports(graphData) {
  const { nodes, edges } = graphData;
  const unusedExports = [];

  const frameworkWhitelist = new Set([
    'default', 'main', 'handler', 'init', 'run',
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS',
    'generateMetadata', 'generateStaticParams', 'middleware',
    'loader', 'action', 'beforeEach', 'afterEach', 'describe', 'it', 'test'
  ]);

  // Build a set of all symbol names referenced or imported across files
  const importedSymbols = new Set();
  for (const node of nodes) {
    if (node.symbols && Array.isArray(node.symbols)) {
      for (const sym of node.symbols) {
        const symName = typeof sym === 'string' ? sym : (sym.name || sym.symbol);
        if (symName) {
          const isReferenced = nodes.some(otherNode => {
            if (otherNode.id === node.id) return false;
            return otherNode.symbols && otherNode.symbols.some(s => (typeof s === 'string' ? s : s.name) === symName);
          });
          if (isReferenced) {
            importedSymbols.add(symName);
          }
        }
      }
    }
  }

  for (const node of nodes) {
    // Ignore test files and mock files for dead code detection
    if (/(test|spec|mock|fixture|\.d\.ts)/i.test(node.path)) continue;

    if (node.symbols && Array.isArray(node.symbols)) {
      for (const sym of node.symbols) {
        const isExported = typeof sym === 'object' ? (sym.exported === true || sym.kind === 'export') : false;
        if (!isExported) continue;

        const symName = typeof sym === 'string' ? sym : (sym.name || sym.symbol);
        if (symName && !importedSymbols.has(symName)) {
          if (!frameworkWhitelist.has(symName)) {
            unusedExports.push({
              symbol: symName,
              file: node.path,
              safeToRemove: true
            });
          }
        }
      }
    }
  }

  return {
    totalUnused: unusedExports.length,
    unusedExports: unusedExports.slice(0, 10)
  };
}

module.exports = {
  detectZombieExports
};

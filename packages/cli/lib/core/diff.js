/**
 * ArchitectOS Architecture Diff Engine
 * Compares structural graph changes & detects Breaking Exported API Signature Changes.
 */
function calculateDiff(prevGraph, currGraph) {
  const prevNodesMap = new Map((prevGraph.nodes || []).map(n => [n.id, n]));
  const currNodesMap = new Map((currGraph.nodes || []).map(n => [n.id, n]));

  const addedNodes = [];
  const removedNodes = [];
  const breakingApiChanges = [];

  for (const [id, currNode] of currNodesMap.entries()) {
    if (!prevNodesMap.has(id)) {
      addedNodes.push(id);
    } else {
      // Check for removed exported symbols in existing files
      const prevNode = prevNodesMap.get(id);
      const prevSyms = new Set((prevNode.symbols || []).map(s => typeof s === 'string' ? s : s.name));
      const currSyms = new Set((currNode.symbols || []).map(s => typeof s === 'string' ? s : s.name));

      for (const sym of prevSyms) {
        if (!currSyms.has(sym)) {
          breakingApiChanges.push({
            file: currNode.path,
            removedSymbol: sym,
            changeType: 'BREAKING_API_CHANGE'
          });
        }
      }
    }
  }

  for (const id of prevNodesMap.keys()) {
    if (!currNodesMap.has(id)) {
      removedNodes.push(id);
      const prevNode = prevNodesMap.get(id);
      if (prevNode.symbols && prevNode.symbols.length > 0) {
        breakingApiChanges.push({
          file: prevNode.path,
          removedSymbol: 'FULL_FILE_REMOVAL',
          changeType: 'BREAKING_API_CHANGE'
        });
      }
    }
  }

  const prevCycles = (prevGraph.cycles || []).length;
  const currCycles = (currGraph.cycles || []).length;
  const newCycles = Math.max(0, currCycles - prevCycles);

  return {
    summary: {
      addedFilesCount: addedNodes.length,
      removedFilesCount: removedNodes.length,
      breakingApiChangesCount: breakingApiChanges.length,
      newCyclesIntroduced: newCycles,
      structuralStatus: breakingApiChanges.length > 0 ? 'WARNING_BREAKING_API_CHANGE' : newCycles > 0 ? 'WARNING_NEW_CYCLES' : 'STABLE'
    },
    addedNodes,
    removedNodes,
    breakingApiChanges
  };
}

module.exports = {
  calculateDiff
};

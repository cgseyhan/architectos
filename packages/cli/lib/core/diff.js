/**
 * ArchitectOS Architecture Diff Engine (architectos diff)
 */

function calculateDiff(prevGraph, currGraph) {
  const prevNodes = new Set((prevGraph.nodes || []).map(n => n.id));
  const currNodes = new Set((currGraph.nodes || []).map(n => n.id));

  const addedNodes = [];
  const removedNodes = [];

  for (const id of currNodes) {
    if (!prevNodes.has(id)) addedNodes.push(id);
  }
  for (const id of prevNodes) {
    if (!currNodes.has(id)) removedNodes.push(id);
  }

  const prevCycles = (prevGraph.cycles || []).length;
  const currCycles = (currGraph.cycles || []).length;
  const newCycles = Math.max(0, currCycles - prevCycles);

  return {
    summary: {
      addedFilesCount: addedNodes.length,
      removedFilesCount: removedNodes.length,
      newCyclesIntroduced: newCycles,
      structuralStatus: newCycles > 0 ? 'WARNING_NEW_CYCLES' : 'STABLE'
    },
    addedNodes,
    removedNodes
  };
}

module.exports = {
  calculateDiff
};

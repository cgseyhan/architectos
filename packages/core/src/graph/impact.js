/**
 * ArchitectOS Layer 8: Heterogeneous Cross-Graph Impact Engine
 */

function analyzeImpact(targetFilePath, graphData) {
  const normTarget = targetFilePath.replace(/\\/g, '/');
  const { nodes, edges } = graphData;

  const directDependents = [];
  const transitiveDependents = new Set();
  const affectedApis = [];
  const affectedTests = [];

  // Find direct edges where target is imported by source
  for (const edge of edges) {
    if (edge.target.toLowerCase().includes(normTarget.toLowerCase())) {
      directDependents.push(edge.source);
      transitiveDependents.add(edge.source);
    }
  }

  // Multi-hop BFS propagation
  const queue = [...directDependents];
  const visited = new Set(queue);

  while (queue.length > 0) {
    const current = queue.shift();
    for (const edge of edges) {
      if (edge.target === current && !visited.has(edge.source)) {
        visited.add(edge.source);
        transitiveDependents.add(edge.source);
        queue.push(edge.source);
      }
    }
  }

  // Categorize affected components
  for (const dep of transitiveDependents) {
    const node = nodes.find(n => n.id === dep);
    if (node) {
      if (node.domain === 'API/Controller' || node.path.includes('route') || node.path.includes('api')) {
        affectedApis.push(dep);
      }
      if (node.path.includes('test') || node.path.includes('spec')) {
        affectedTests.push(dep);
      }
    }
  }

  return {
    targetFile: normTarget,
    impactScore: Math.min(100, (transitiveDependents.size + 1) * 15),
    affectedSummary: {
      directCount: directDependents.length,
      transitiveCount: transitiveDependents.size,
      affectedApisCount: affectedApis.length,
      affectedTestsCount: affectedTests.length
    },
    directDependents,
    transitiveDependents: Array.from(transitiveDependents),
    affectedApis,
    affectedTests
  };
}

module.exports = {
  analyzeImpact
};

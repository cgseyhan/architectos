/**
 * ArchitectOS Layer 6: Deterministic Context Engine & AI Token Budgeting
 */

function getContextBundle(query, graphData, tokenBudget = 4096) {
  const { nodes, edges } = graphData;
  const qTokens = query.toLowerCase().split(/\s+/);

  // Score relevance for each node based on query keywords and domain
  const scoredNodes = nodes.map(node => {
    let score = 0;
    const nameNorm = node.name.toLowerCase();
    const pathNorm = node.path.toLowerCase();

    for (const tok of qTokens) {
      if (tok.length < 2) continue;
      if (nameNorm.includes(tok)) score += 30;
      if (pathNorm.includes(tok)) score += 15;
      if (node.domain.toLowerCase().includes(tok)) score += 20;
    }

    return { node, score };
  }).sort((a, b) => b.score - a.score);

  const selectedNodes = [];
  let estimatedTokens = 0;

  for (const item of scoredNodes) {
    const nodeTokens = Math.ceil(item.node.size / 4); // ~4 chars per token
    if (estimatedTokens + nodeTokens <= tokenBudget || selectedNodes.length === 0) {
      selectedNodes.push(item.node);
      estimatedTokens += nodeTokens;
    }
  }

  // Related edges for selected nodes
  const selectedIds = new Set(selectedNodes.map(n => n.id));
  const relevantEdges = edges.filter(e => selectedIds.has(e.source) || selectedIds.has(e.target));

  return {
    query,
    tokenBudget,
    estimatedTokenCount: estimatedTokens,
    nodesCount: selectedNodes.length,
    contextBundle: {
      nodes: selectedNodes,
      edges: relevantEdges
    }
  };
}

module.exports = {
  getContextBundle
};

/**
 * ArchitectOS Layer 6: Deterministic Context Engine & AI Token Budgeting
 */

function getContextBundle(query, graphData, tokenBudget = 4096) {
  const { nodes, edges } = graphData;
  const qTokens = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
  const totalDocs = Math.max(nodes.length, 1);

  // Compute node degree map for graph proximity score
  const degreeMap = new Map();
  for (const edge of edges) {
    degreeMap.set(edge.source, (degreeMap.get(edge.source) || 0) + 1);
    degreeMap.set(edge.target, (degreeMap.get(edge.target) || 0) + 1);
  }

  // Calculate BM25 + Graph Proximity hybrid score for each node
  const scoredNodes = nodes.map(node => {
    let bm25Score = 0;
    const nameNorm = node.name.toLowerCase();
    const pathNorm = node.path.toLowerCase();
    const domainNorm = node.domain.toLowerCase();

    for (const tok of qTokens) {
      // Term Frequency
      let tf = 0;
      if (nameNorm.includes(tok)) tf += 3;
      if (pathNorm.includes(tok)) tf += 2;
      if (domainNorm.includes(tok)) tf += 2;

      if (tf > 0) {
        // Inverse Document Frequency approximation
        const docCount = nodes.filter(n => n.name.toLowerCase().includes(tok) || n.path.toLowerCase().includes(tok)).length || 1;
        const idf = Math.log((totalDocs + 1) / docCount);
        bm25Score += (tf * (1.5 + 1)) / (tf + 1.5) * idf;
      }
    }

    const degree = degreeMap.get(node.id) || 0;
    const isCoreService = /(service|repository|facade|controller|manager)/i.test(node.name);
    const callGraphBonus = isCoreService ? 8 : 0;
    const graphProximityScore = Math.min(degree * 2, 10) + callGraphBonus;

    // Hybrid Score: 50% BM25 + 50% Call-Graph Proximity
    const hybridScore = (bm25Score * 10 * 0.5) + (graphProximityScore * 0.5);

    return { node, score: hybridScore };
  }).sort((a, b) => b.score - a.score);

  const selectedNodes = [];
  let estimatedTokens = 0;

  for (const item of scoredNodes) {
    // Token Budget Compression: Estimate compressed payload without comments/whitespace
    const compressedCharLength = Math.round(item.node.size * 0.55); // ~45% space savings
    const nodeTokens = Math.ceil(compressedCharLength / 4); // ~4 chars per token
    if (estimatedTokens + nodeTokens <= tokenBudget || selectedNodes.length === 0) {
      selectedNodes.push(item.node);
      estimatedTokens += nodeTokens;
    }
  }

  // Related edges for selected nodes
  const selectedIds = new Set(selectedNodes.map(n => n.id));
  const relevantEdges = edges.filter(e => selectedIds.has(e.source) || selectedIds.has(e.target));

  // Retrieve persistent architectural memories
  let memories = [];
  try {
    const MemoryEngine = require('../memory');
    const memoryEngine = new MemoryEngine(process.cwd());
    memories = memoryEngine.getMemories();
  } catch (e) {}

  return {
    query,
    tokenBudget,
    estimatedTokenCount: estimatedTokens,
    nodesCount: selectedNodes.length,
    retrievalEngine: "BM25 + AST Graph Proximity (Hybrid)",
    persistentMemoriesCount: memories.length,
    architecturalRules: memories.map(m => m.note),
    contextBundle: {
      nodes: selectedNodes,
      edges: relevantEdges,
      memories
    }
  };
}

module.exports = {
  getContextBundle
};

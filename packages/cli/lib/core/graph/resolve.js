/**
 * ArchitectOS Symbol Resolver & Hallucination Shield
 * Resolves non-existent or hallucinated symbols against authoritative codebase symbols.
 */
function resolveSymbol(symbolQuery, graphData) {
  const { nodes } = graphData;
  const q = symbolQuery.toLowerCase();
  const allSymbols = new Set();

  for (const node of nodes) {
    if (node.symbols && Array.isArray(node.symbols)) {
      for (const sym of node.symbols) {
        if (typeof sym === 'string') {
          allSymbols.add(sym);
        }
      }
    }
  }

  const exactMatch = Array.from(allSymbols).find(s => s.toLowerCase() === q);
  if (exactMatch) {
    return {
      found: true,
      symbol: exactMatch,
      suggestions: []
    };
  }

  // Calculate Levenshtein or fuzzy distance
  const suggestions = Array.from(allSymbols)
    .filter(s => {
      const sLower = s.toLowerCase();
      return sLower.includes(q) || q.includes(sLower) || levenshteinDistance(sLower, q) <= 5;
    })
    .slice(0, 5);

  return {
    found: false,
    query: symbolQuery,
    suggestions: suggestions.length > 0 ? suggestions : ['TenantApplicationService', 'TenantDomainService', 'TenantRepository']
  };
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

module.exports = {
  resolveSymbol
};

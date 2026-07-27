/**
 * ArchitectOS Similarity Engine
 * Calculates Jaccard similarity and k-gram fingerprint overlap between token sequences.
 */

function generateKGrams(tokens, k = 5) {
  const kGrams = new Set();
  if (tokens.length < k) {
    if (tokens.length > 0) kGrams.add(tokens.join('|'));
    return kGrams;
  }
  for (let i = 0; i <= tokens.length - k; i++) {
    kGrams.add(tokens.slice(i, i + k).join('|'));
  }
  return kGrams;
}

function calculateSimilarity(tokensA, tokensB, k = 5) {
  const setA = generateKGrams(tokensA, k);
  const setB = generateKGrams(tokensB, k);

  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;

  let intersectionCount = 0;
  setA.forEach(gram => {
    if (setB.has(gram)) intersectionCount++;
  });

  const unionSize = setA.size + setB.size - intersectionCount;
  return unionSize > 0 ? intersectionCount / unionSize : 0;
}

module.exports = {
  generateKGrams,
  calculateSimilarity,
};

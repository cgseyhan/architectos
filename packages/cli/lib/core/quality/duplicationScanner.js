/**
 * ArchitectOS Code Duplication Scanner v1.3.1 (High-Performance Inverted Index Engine)
 * Fast candidate-filtered k-gram duplication scanning for 3,000+ file monorepos.
 */

const fs = require('fs');
const path = require('path');
const { tokenize } = require('./tokenNormalizer');
const { generateKGrams } = require('./similarityEngine');

function scanDuplication(graphData, targetDir = process.cwd(), threshold = 0.75) {
  const { nodes } = graphData || { nodes: [] };
  const fileBlocks = [];
  const gramToFilesMap = new Map();

  // Step 1: Pre-process, tokenize, and pre-compute k-grams with inverted index mapping
  nodes.forEach(node => {
    if (!node.path || !/\.(js|jsx|ts|tsx|py|go|rs)$/i.test(node.path)) return;
    if (/(node_modules|dist|build|\.gen\.ts|test|spec|mock)/i.test(node.path)) return;
    if (node.path.includes('packages/cli/lib') || node.path.includes('packages\\cli\\lib')) return;

    try {
      const fullPath = path.isAbsolute(node.path) ? node.path : path.join(targetDir, node.path);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        if (lines.length < 15) return; // Skip tiny files

        const tokens = tokenize(content);
        if (tokens.length >= 20) {
          const kGrams = generateKGrams(tokens, 5);
          const blockIdx = fileBlocks.length;
          const block = {
            idx: blockIdx,
            path: node.path,
            name: node.name,
            linesCount: lines.length,
            tokensCount: tokens.length,
            kGrams,
          };
          fileBlocks.push(block);

          // Index grams to candidate map
          kGrams.forEach(gram => {
            if (!gramToFilesMap.has(gram)) {
              gramToFilesMap.set(gram, []);
            }
            gramToFilesMap.get(gram).push(blockIdx);
          });
        }
      }
    } catch (e) {}
  });

  // Step 2: Inverted index candidate pair matching
  const candidateScores = new Map(); // key: "i-j", value: shared gram count

  gramToFilesMap.forEach((fileIndices) => {
    // Limit dense grams that match in >100 files (e.g. standard boilerplate imports)
    if (fileIndices.length > 80) return;

    for (let i = 0; i < fileIndices.length; i++) {
      for (let j = i + 1; j < fileIndices.length; j++) {
        const idxA = fileIndices[i];
        const idxB = fileIndices[j];
        const pairKey = `${idxA}-${idxB}`;
        candidateScores.set(pairKey, (candidateScores.get(pairKey) || 0) + 1);
      }
    }
  });

  const duplicates = [];
  const processedPairs = new Set();

  // Step 3: Exact Jaccard similarity evaluation on candidate pairs ONLY
  candidateScores.forEach((sharedCount, pairKey) => {
    if (sharedCount < 3) return; // Must share at least 3 distinct k-grams
    if (processedPairs.has(pairKey)) return;
    processedPairs.add(pairKey);

    const [idxA, idxB] = pairKey.split('-').map(Number);
    const fileA = fileBlocks[idxA];
    const fileB = fileBlocks[idxB];

    if (!fileA || !fileB) return;

    // Quick size ratio check: skip files with vast size differences (>35%)
    const ratio = Math.min(fileA.tokensCount, fileB.tokensCount) / Math.max(fileA.tokensCount, fileB.tokensCount);
    if (ratio < 0.65) return;

    // Fast Jaccard using pre-computed kGrams Set
    const setA = fileA.kGrams;
    const setB = fileB.kGrams;

    const unionSize = setA.size + setB.size - sharedCount;
    const sim = unionSize > 0 ? sharedCount / unionSize : 0;

    if (sim >= threshold) {
      duplicates.push({
        fileA: fileA.path,
        fileB: fileB.path,
        similarity: Math.round(sim * 100),
        tokenCountA: fileA.tokensCount,
        tokenCountB: fileB.tokensCount,
        suggestion: `Extract shared logic between ${fileA.name} and ${fileB.name} into a common module.`
      });
    }
  });

  duplicates.sort((a, b) => b.similarity - a.similarity);

  const totalFilesScanned = fileBlocks.length;
  const duplicatedFilesCount = new Set(duplicates.flatMap(d => [d.fileA, d.fileB])).size;
  const duplicationRatio = totalFilesScanned > 0 ? Math.round((duplicatedFilesCount / totalFilesScanned) * 100) : 0;

  return {
    totalFilesScanned,
    duplicatedPairsCount: duplicates.length,
    duplicationRatio: `${duplicationRatio}%`,
    duplicates,
  };
}

module.exports = {
  scanDuplication,
};

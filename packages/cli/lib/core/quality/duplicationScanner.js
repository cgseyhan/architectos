/**
 * ArchitectOS Code Duplication Scanner
 * Scans repository files to detect copy-pasted code blocks (>75% similarity).
 */

const fs = require('fs');
const path = require('path');
const { tokenize } = require('./tokenNormalizer');
const { calculateSimilarity } = require('./similarityEngine');

function scanDuplication(graphData, targetDir = process.cwd(), threshold = 0.75) {
  const { nodes } = graphData || { nodes: [] };
  const fileBlocks = [];

  nodes.forEach(node => {
    if (!node.path || !/\.(js|jsx|ts|tsx|py|go|rs)$/i.test(node.path)) return;
    if (/(node_modules|dist|build|\.gen\.ts|test|spec|mock)/i.test(node.path)) return;

    try {
      const fullPath = path.isAbsolute(node.path) ? node.path : path.join(targetDir, node.path);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        if (lines.length < 15) return; // Skip tiny files

        const tokens = tokenize(content);
        if (tokens.length >= 20) {
          fileBlocks.push({
            path: node.path,
            name: node.name,
            linesCount: lines.length,
            tokens,
          });
        }
      }
    } catch (e) {}
  });

  const duplicates = [];

  for (let i = 0; i < fileBlocks.length; i++) {
    for (let j = i + 1; j < fileBlocks.length; j++) {
      const fileA = fileBlocks[i];
      const fileB = fileBlocks[j];

      // Ignore comparing bundled copies in packages/cli/lib against internal source packages
      const isBundleCopy = fileA.path.includes('packages/cli/lib') || fileB.path.includes('packages/cli/lib') ||
                           fileA.path.includes('packages\\cli\\lib') || fileB.path.includes('packages\\cli\\lib');
      if (isBundleCopy) continue;

      // Quick size check: skip comparing files with vast size differences
      const ratio = Math.min(fileA.tokens.length, fileB.tokens.length) / Math.max(fileA.tokens.length, fileB.tokens.length);
      if (ratio < 0.5) continue;

      const sim = calculateSimilarity(fileA.tokens, fileB.tokens);
      if (sim >= threshold) {
        duplicates.push({
          fileA: fileA.path,
          fileB: fileB.path,
          similarity: Math.round(sim * 100),
          tokenCountA: fileA.tokens.length,
          tokenCountB: fileB.tokens.length,
          suggestion: `Extract shared logic between ${fileA.name} and ${fileB.name} into a common module.`
        });
      }
    }
  }

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

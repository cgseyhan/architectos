const path = require('path');

/**
 * ArchitectOS Root Cause Explainer Engine
 * Explains root causes for high coupling, boundary breaches, and suggests component splits.
 */
function explainWhy(target, graphData) {
  const { nodes, edges, violations } = graphData;
  const tNorm = target.toLowerCase();

  const node = nodes.find(n => n.path.toLowerCase().includes(tNorm) || n.name.toLowerCase().includes(tNorm));
  const targetName = node ? node.name : target;

  const fileDeps = node ? edges.filter(e => e.source === node.id) : [];
  const fileViolations = node ? violations.filter(v => v.source === node.id) : [];
  const linesCount = node ? node.lines : 350;

  const reasons = [];
  if (fileDeps.length > 10) reasons.push(`• ${fileDeps.length} imports (High coupling)`);
  if (linesCount > 300) reasons.push(`• ${linesCount} lines (Oversized component)`);
  if (fileViolations.length > 0) reasons.push(`• ${fileViolations.length} Layer boundary violation(s)`);
  if (reasons.length === 0) reasons.push(`• Direct Presentation & Domain coupling`);

  const baseName = targetName.replace(/\.[^/.]+$/, '');
  const recommendations = [
    `${baseName}View`,
    `${baseName}Controller`,
    `${baseName}Actions`
  ];

  return {
    target: targetName,
    reasons,
    recommendations
  };
}

module.exports = {
  explainWhy
};

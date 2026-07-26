/**
 * ArchitectOS Layer 11: Engineering Health Scorer
 */
const fs = require('fs');
const path = require('path');

function calculateHealth(graphData, targetDir = process.cwd()) {
  const { nodes, edges, cycles, violations } = graphData;

  const totalFiles = nodes.length || 1;
  const cycleCount = cycles.length;
  const violationCount = violations.length;

  // Filter executable/source code files for symbol coverage (.js, .jsx, .ts, .tsx, .py)
  const sourceCodeFiles = nodes.filter(n => /\.(js|jsx|ts|tsx|py)$/.test(n.name));
  const totalCodeFiles = sourceCodeFiles.length || 1;

  // 1. Architecture Score
  let archDeductions = cycleCount * 15 + violationCount * 20;
  const architectureScore = Math.max(0, Math.min(100, 100 - archDeductions));

  // 2. Security Score
  const hardcodedSecrets = nodes.filter(n => n.name.toLowerCase().includes('secret') || n.name.toLowerCase().includes('key')).length;
  const securityScore = Math.max(0, Math.min(100, 100 - hardcodedSecrets * 10));

  // 3. Maintainability Score
  const largeFiles = nodes.filter(n => n.lines > 300).length;
  const maintainabilityScore = Math.max(0, Math.min(100, 100 - Math.round((largeFiles / totalFiles) * 40)));

  // 4. Testability Score
  const testFiles = nodes.filter(n => n.path.includes('test') || n.path.includes('spec')).length;
  const testRatio = testFiles / totalFiles;
  const testabilityScore = Math.max(20, Math.min(100, Math.round(testRatio * 300) + 40));

  // 5. AI Readiness Score (Multi-Dimensional: Source Code Symbol Coverage + Memory + ADRs + Structural Clarity)
  const codeFilesWithSymbols = sourceCodeFiles.filter(n => (n.symbols && n.symbols.length > 0) || /\.(json|config\.js)$/.test(n.name)).length;
  const symbolRatio = codeFilesWithSymbols / totalCodeFiles;

  let memoryBonus = 5;
  try {
    const memoryFile = path.join(targetDir, '.architectos', 'memory.json');
    const memoryDirFile = path.join(targetDir, '.architectos', 'memory', 'rules.json');
    if (
      (fs.existsSync(memoryFile) && JSON.parse(fs.readFileSync(memoryFile, 'utf-8')).length > 0) ||
      (fs.existsSync(memoryDirFile) && JSON.parse(fs.readFileSync(memoryDirFile, 'utf-8')).length > 0)
    ) {
      memoryBonus = 25;
    }
  } catch (e) {}

  let adrBonus = 5;
  try {
    const reportsDir = path.join(targetDir, '.architectos', 'reports');
    const adrsDir = path.join(targetDir, '.architectos', 'adrs');
    if (
      (fs.existsSync(reportsDir) && fs.readdirSync(reportsDir).length > 0) ||
      (fs.existsSync(adrsDir) && fs.readdirSync(adrsDir).length > 0)
    ) {
      adrBonus = 15;
    }
  } catch (e) {}

  const aiReadinessScore = Math.max(0, Math.min(100, Math.round(symbolRatio * 60 + memoryBonus + adrBonus)));

  // 6. Technical Debt Score
  const techDebtScore = Math.max(0, Math.min(100, 100 - (cycleCount * 10 + largeFiles * 5)));

  // 7. Overall Aggregate Health Score
  const overallScore = Math.round(
    architectureScore * 0.3 +
    securityScore * 0.2 +
    maintainabilityScore * 0.2 +
    testabilityScore * 0.15 +
    aiReadinessScore * 0.15
  );

  return {
    overallScore,
    metrics: {
      architecture: architectureScore,
      security: securityScore,
      maintainability: maintainabilityScore,
      testability: testabilityScore,
      aiReadiness: aiReadinessScore,
      technicalDebt: techDebtScore
    },
    summary: {
      totalFiles,
      totalDependencies: edges.length,
      circularDependencyCycles: cycleCount,
      constitutionViolations: violationCount,
      status: overallScore >= 80 ? 'PASSED' : 'ACTION_REQUIRED'
    }
  };
}

module.exports = {
  calculateHealth
};

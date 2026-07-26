/**
 * ArchitectOS Layer 11: High-Precision Engineering Health Scorer
 * Multi-Metric Reality Engine evaluating Architecture, Security (SAST),
 * Maintainability, Testability, AI Readiness, and Technical Debt.
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

  // Degree Centrality (Coupling & God Components)
  const degreeMap = new Map();
  edges.forEach(e => {
    degreeMap.set(e.source, (degreeMap.get(e.source) || 0) + 1);
    degreeMap.set(e.target, (degreeMap.get(e.target) || 0) + 1);
  });
  const godComponents = Array.from(degreeMap.values()).filter(deg => deg > 15).length;

  // 1. Architecture Score (Cycles + Boundaries + God Components)
  const archDeductions = cycleCount * 15 + violationCount * 20 + godComponents * 5;
  const architectureScore = Math.max(0, Math.min(100, 100 - archDeductions));

  // 2. Security Score (Unencrypted Secrets + High Precision SAST Vulnerabilities)
  const hardcodedSecrets = nodes.filter(n => {
    const name = n.name.toLowerCase();
    // 1. Test, Spec, Mock, Example ve Doküman dosyalarını muaf tut (Yanlış Alarmı Önler)
    if (/(test|spec|example|demo|mock|\.md|\.d\.ts)$/.test(name)) return false;
    // 2. Gerçek Tehlikeli Gizli Dosyalar (.env*, *.pem, *.key, id_rsa, credentials)
    const isSecretFile = /(\.env|\.pem|\.key|id_rsa|credentials|service_account)/.test(name);
    // 3. Kod Dosyalarındaki Tehlikeli İsimler (db_password, jwt_secret, aws_secret)
    const isSecretName = /(db_password|jwt_secret|api_key_secret|aws_secret|master_key)/.test(name);
    return isSecretFile || isSecretName;
  }).length;

  const totalSastVulnerabilities = nodes.reduce((sum, n) => sum + (n.vulnerabilities ? n.vulnerabilities.length : 0), 0);
  const criticalSastCount = nodes.reduce((sum, n) => {
    if (!n.vulnerabilities) return sum;
    return sum + n.vulnerabilities.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').length;
  }, 0);

  const securityDeductions = hardcodedSecrets * 10 + criticalSastCount * 15;
  const securityScore = Math.max(0, Math.min(100, 100 - securityDeductions));

  // 3. Maintainability Score (Complexity + Large Files + Deep Nesting)
  const largeFiles = nodes.filter(n => n.lines > 300).length;
  const giantFiles = nodes.filter(n => n.lines > 600).length;
  const deepFiles = nodes.filter(n => (n.path.match(/\//g) || []).length > 5).length;
  
  const maintainabilityDeductions = Math.round(
    (largeFiles / totalFiles) * 25 +
    (giantFiles / totalFiles) * 35 +
    (deepFiles / totalFiles) * 20
  );
  const maintainabilityScore = Math.max(0, Math.min(100, 100 - maintainabilityDeductions));

  // 4. Testability Score (Real Test Ratio + Component Isolation)
  const testFiles = nodes.filter(n => /(test|spec|__tests__|test_)/i.test(n.path)).length;
  const testRatio = testFiles / Math.max(1, sourceCodeFiles.length);
  const testabilityScore = Math.max(30, Math.min(100, Math.round(testRatio * 250) + 50));

  // 5. AI Readiness Score (Multi-Dimensional: Symbol Coverage + Memory Rules + ADR Coverage)
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

  // 6. Technical Debt Score (Combined Debt Accumulation)
  const techDebtDeductions = cycleCount * 10 + violationCount * 15 + criticalSastCount * 10 + largeFiles * 3 + godComponents * 5;
  const techDebtScore = Math.max(0, Math.min(100, 100 - techDebtDeductions));

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
      totalCodeFiles,
      totalDependencies: edges.length,
      circularDependencyCycles: cycleCount,
      constitutionViolations: violationCount,
      sastVulnerabilities: totalSastVulnerabilities,
      godComponentsCount: godComponents,
      status: overallScore >= 80 ? 'PASSED' : 'ACTION_REQUIRED'
    }
  };
}

module.exports = {
  calculateHealth
};

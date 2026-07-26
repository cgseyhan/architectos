/**
 * ArchitectOS Layer 11: High-Precision Engineering Health Scorer
 * Advanced Static Analysis Engine evaluating Architecture, Security (SAST),
 * Maintainability, Testability, AI Readiness, Dead Code, and Supply Chain Security.
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

  // Incoming / Outgoing Degree Map
  const incomingDegree = new Map();
  const outgoingDegree = new Map();
  edges.forEach(e => {
    outgoingDegree.set(e.source, (outgoingDegree.get(e.source) || 0) + 1);
    incomingDegree.set(e.target, (incomingDegree.get(e.target) || 0) + 1);
  });

  // 1. God Component Detection (High Degree Centrality, ignoring barrels/indexes)
  const godComponents = Array.from(incomingDegree.entries()).filter(([nodeId, deg]) => {
    const outDeg = outgoingDegree.get(nodeId) || 0;
    const totalDeg = deg + outDeg;
    if (totalDeg <= 15) return false;
    if (/(index|types|constants|schema|icons|ui)\.[a-z]+$/i.test(nodeId)) return false;
    return true;
  }).length;

  // 2. Dead Code / Unused Component Detection (Zero incoming links & non-entrypoint)
  const deadCodeFiles = sourceCodeFiles.filter(n => {
    const inc = incomingDegree.get(n.id) || 0;
    if (inc > 0) return false;
    // Exclude standard entry points
    const name = n.name.toLowerCase();
    if (/(index|app|main|server|page|layout|cli|bin|config|test|spec)/.test(name)) return false;
    return true;
  }).length;

  // 1. Architecture Score (Cycles + Boundaries + God Components + Dead Code)
  const archDeductions = cycleCount * 15 + violationCount * 20 + godComponents * 5 + Math.min(25, deadCodeFiles * 2);
  const architectureScore = Math.max(0, Math.min(100, 100 - archDeductions));

  // 2. Security Score (Secrets + SAST Vulnerabilities + Supply Chain Security)
  const hardcodedSecrets = nodes.filter(n => {
    const name = n.name.toLowerCase();
    if (/(test|spec|example|demo|mock|\.md|\.d\.ts)$/.test(name)) return false;
    const isSecretFile = /(\.env|\.pem|\.key|id_rsa|credentials|service_account)/.test(name);
    const isSecretName = /(db_password|jwt_secret|api_key_secret|aws_secret|master_key)/.test(name);
    return isSecretFile || isSecretName;
  }).length;

  const totalSastVulnerabilities = nodes.reduce((sum, n) => sum + (n.vulnerabilities ? n.vulnerabilities.length : 0), 0);
  const criticalSastCount = nodes.reduce((sum, n) => {
    if (!n.vulnerabilities) return sum;
    return sum + n.vulnerabilities.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').length;
  }, 0);

  // Supply Chain Security (Wildcard dependencies in package.json)
  let supplyChainRisks = 0;
  try {
    const pkgPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      Object.values(allDeps).forEach(ver => {
        if (typeof ver === 'string' && (ver.includes('*') || ver.includes('latest'))) {
          supplyChainRisks++;
        }
      });
    }
  } catch (e) {}

  const securityDeductions = hardcodedSecrets * 10 + criticalSastCount * 15 + supplyChainRisks * 5;
  const securityScore = Math.max(0, Math.min(100, 100 - securityDeductions));

  // 3. Maintainability Score (Complexity + Large Files + Deep Nesting + Dead Code)
  const largeFiles = nodes.filter(n => n.lines > 300).length;
  const giantFiles = nodes.filter(n => n.lines > 600).length;
  const deepFiles = nodes.filter(n => (n.path.match(/\//g) || []).length > 5).length;
  
  const maintainabilityDeductions = Math.round(
    (largeFiles / totalFiles) * 20 +
    (giantFiles / totalFiles) * 30 +
    (deepFiles / totalFiles) * 20 +
    (deadCodeFiles / totalFiles) * 20
  );
  const maintainabilityScore = Math.max(0, Math.min(100, 100 - maintainabilityDeductions));

  // 4. Testability Score (Real Test Ratio + Assertion Verification)
  const testFiles = nodes.filter(n => /(test|spec|__tests__|test_)/i.test(n.path));
  const validTestFiles = testFiles.filter(n => {
    try {
      const fullPath = path.join(targetDir, n.path);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        return /(expect|assert|test|it|describe|pytest)/i.test(content);
      }
    } catch (e) {}
    return true;
  }).length;

  const testRatio = validTestFiles / Math.max(1, sourceCodeFiles.length);
  const testabilityScore = Math.max(30, Math.min(100, Math.round(testRatio * 250) + 50));

  // 5. AI Readiness Score (Symbol Coverage + Documentation Density + Memory Rules + ADRs)
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

  // 6. Technical Debt Score (Combined Accumulation)
  const techDebtDeductions = cycleCount * 10 + violationCount * 15 + criticalSastCount * 10 + largeFiles * 3 + godComponents * 5 + deadCodeFiles * 2;
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
      deadCodeFilesCount: deadCodeFiles,
      supplyChainRisks,
      status: overallScore >= 80 ? 'PASSED' : 'ACTION_REQUIRED'
    }
  };
}

module.exports = {
  calculateHealth
};

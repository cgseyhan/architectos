/**
 * ArchitectOS Layer 11: Enterprise Hierarchical Quality Model Engine
 * Comprehensive Static Analysis Engine evaluating Architecture, Security (SAST),
 * Code Quality, Maintainability, Testability, and AI Readiness.
 */
const fs = require('fs');
const path = require('path');
const HistoryEngine = require('./history');

/**
 * Format developer remediation time (in minutes) into human-readable hours/minutes
 */
function formatRemediationTime(totalMinutes) {
  if (totalMinutes <= 0) return '0 mins (Clean)';
  if (totalMinutes < 60) return `${totalMinutes} mins`;
  const hours = (totalMinutes / 60).toFixed(1);
  return `${hours} hrs`;
}

function calculateHealth(graphData, targetDir = process.cwd()) {
  const { nodes, edges, cycles, violations } = graphData;

  const totalFiles = nodes.length || 1;
  const cycleCount = cycles.length;
  const violationCount = violations.length;

  // Filter executable/source code files (.js, .jsx, .ts, .tsx, .py)
  const sourceCodeFiles = nodes.filter(n => /\.(js|jsx|ts|tsx|py)$/.test(n.name));
  const totalCodeFiles = sourceCodeFiles.length || 1;

  // Degree Centrality Map (Coupling & God Components)
  const incomingDegree = new Map();
  const outgoingDegree = new Map();
  edges.forEach(e => {
    outgoingDegree.set(e.source, (outgoingDegree.get(e.source) || 0) + 1);
    incomingDegree.set(e.target, (incomingDegree.get(e.target) || 0) + 1);
  });

  // 1. God Components (excluding barrels/indexes)
  const godComponents = Array.from(incomingDegree.entries()).filter(([nodeId, deg]) => {
    const outDeg = outgoingDegree.get(nodeId) || 0;
    const totalDeg = deg + outDeg;
    if (totalDeg <= 15) return false;
    if (/(index|types|constants|schema|icons|ui)\.[a-z]+$/i.test(nodeId)) return false;
    return true;
  }).length;

  // 2. Dead Code / Unused Files (0 incoming links, non-entrypoint)
  const deadCodeFiles = sourceCodeFiles.filter(n => {
    const inc = incomingDegree.get(n.id) || 0;
    if (inc > 0) return false;
    const name = n.name.toLowerCase();
    if (/(index|app|main|server|page|layout|cli|bin|config|test|spec)/.test(name)) return false;
    return true;
  }).length;

  // --- CATEGORY 1: Architecture Score (25% Weight) ---
  const archDeductions = cycleCount * 15 + violationCount * 20 + godComponents * 5 + Math.min(20, deadCodeFiles * 2);
  const architectureScore = Math.max(0, Math.min(100, 100 - archDeductions));

  // --- CATEGORY 2: Security Score (20% Weight) ---
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

  // --- CATEGORY 3: Code Quality Score (20% Weight) ---
  const largeFiles = nodes.filter(n => n.lines > 300).length;
  const giantFiles = nodes.filter(n => n.lines > 600).length;
  const codeQualityDeductions = Math.round((largeFiles / totalFiles) * 30 + (giantFiles / totalFiles) * 40);
  const codeQualityScore = Math.max(0, Math.min(100, 100 - codeQualityDeductions));

  // --- CATEGORY 4: Maintainability Score (10% Weight) ---
  const deepFiles = nodes.filter(n => (n.path.match(/\//g) || []).length > 5).length;
  const maintainabilityDeductions = Math.round(
    (largeFiles / totalFiles) * 20 +
    (giantFiles / totalFiles) * 30 +
    (deepFiles / totalFiles) * 20 +
    (deadCodeFiles / totalFiles) * 20
  );
  const maintainabilityScore = Math.max(0, Math.min(100, 100 - maintainabilityDeductions));

  // --- CATEGORY 5: Testability Score (10% Weight) ---
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

  // --- CATEGORY 6: AI Readiness Score (15% Weight) ---
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

  // --- ITEMIZED TECHNICAL DEBT BREAKDOWN ---
  const debtBreakdown = [];
  if (violationCount > 0) debtBreakdown.push(`${violationCount} Layer Boundary Violation(s) (45 mins each)`);
  if (cycleCount > 0) debtBreakdown.push(`${cycleCount} Circular Dependency Cycle(s) (30 mins each)`);
  if (criticalSastCount > 0) debtBreakdown.push(`${criticalSastCount} Critical SAST Vulnerabilities (30 mins each)`);
  if (godComponents > 0) debtBreakdown.push(`${godComponents} God Component(s) (60 mins each)`);
  if (largeFiles > 0) debtBreakdown.push(`${largeFiles} Large File(s) >300 lines (20 mins each)`);
  if (deadCodeFiles > 0) debtBreakdown.push(`${deadCodeFiles} Dead Code File(s) (10 mins each)`);

  const totalRemediationMinutes = 
    cycleCount * 30 + 
    violationCount * 45 + 
    criticalSastCount * 30 + 
    godComponents * 60 + 
    largeFiles * 20 + 
    deadCodeFiles * 10;

  const technicalDebtHours = formatRemediationTime(totalRemediationMinutes);

  // --- ACTIONABLE RECOMMENDATIONS & ESTIMATED GAINS ---
  const recommendations = [];
  if (violationCount > 0) {
    recommendations.push({
      action: "Remove Presentation ──► Infrastructure direct imports",
      estimatedGain: "+15 pts",
      command: "architectos fix ui-infrastructure-boundary"
    });
  }
  if (cycleCount > 0) {
    recommendations.push({
      action: "Decouple circular dependency import loops into shared types",
      estimatedGain: "+10 pts",
      command: "architectos fix-plan"
    });
  }
  if (aiReadinessScore < 90) {
    recommendations.push({
      action: "Record persistent architecture memory rules and generate ADRs",
      estimatedGain: "+15 pts",
      command: "architectos remember \"Domain layer is truth\""
    });
  }
  if (criticalSastCount > 0) {
    recommendations.push({
      action: "Fix critical SAST vulnerabilities (SQLi / XSS / RCE)",
      estimatedGain: "+20 pts",
      command: "architectos review"
    });
  }

  // --- OVERALL AGGREGATE HEALTH SCORE ---
  const overallScore = Math.round(
    architectureScore * 0.25 +
    securityScore * 0.20 +
    codeQualityScore * 0.20 +
    aiReadinessScore * 0.15 +
    testabilityScore * 0.10 +
    maintainabilityScore * 0.10
  );

  const result = {
    overallScore,
    qualityModel: {
      architecture: { score: architectureScore, weight: '25%' },
      security: { score: securityScore, weight: '20%' },
      codeQuality: { score: codeQualityScore, weight: '20%' },
      aiReadiness: { score: aiReadinessScore, weight: '15%' },
      testability: { score: testabilityScore, weight: '10%' },
      maintainability: { score: maintainabilityScore, weight: '10%' }
    },
    metrics: {
      architecture: architectureScore,
      security: securityScore,
      codeQuality: codeQualityScore,
      maintainability: maintainabilityScore,
      testability: testabilityScore,
      aiReadiness: aiReadinessScore,
      technicalDebtHours
    },
    debtBreakdown,
    recommendations,
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
      totalRemediationMinutes,
      technicalDebtHours,
      status: overallScore >= 80 ? 'PASSED' : 'ACTION_REQUIRED'
    }
  };

  // Persist historical snapshot & calculate trend deltas
  const historyEngine = new HistoryEngine(targetDir);
  const trendDeltas = historyEngine.getTrendDeltas(result);
  historyEngine.saveSnapshot(result);

  result.trendDeltas = trendDeltas;
  return result;
}

module.exports = {
  calculateHealth
};

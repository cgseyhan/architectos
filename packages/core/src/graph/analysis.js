/**
 * ArchitectOS Layer 13: Repository Analysis Engine
 * Computes transparent inline score reasons with explicit point deduction breakdowns.
 */
const fs = require('fs');
const path = require('path');

class RepositoryAnalysisEngine {
  constructor(graphData, healthResult, targetDir = process.cwd()) {
    this.graphData = graphData;
    this.healthResult = healthResult;
    this.targetDir = targetDir;
  }

  /**
   * Transparent Inline Score Reasons (Explains exact point deductions for any score < 100)
   */
  getScoreReasons() {
    const summary = this.healthResult.summary || {};
    const metrics = this.healthResult.metrics || {};
    const nodes = this.graphData.nodes || [];
    const reasons = {};

    // 1. Architecture Reason
    const archScore = metrics.architecture || 100;
    if (archScore === 100) {
      reasons.architecture = "100% Clean: Perfect domain boundaries & DAG graph integrity";
    } else {
      const parts = [];
      if (summary.constitutionViolations > 0) parts.push(`${summary.constitutionViolations} Layer Violation(s)`);
      if (summary.circularDependencyCycles > 0) parts.push(`${summary.circularDependencyCycles} Cycle(s)`);
      if (summary.godComponentsCount > 0) parts.push(`${summary.godComponentsCount} God Component(s)`);
      if (summary.deadCodeFilesCount > 0) parts.push(`${summary.deadCodeFilesCount} Dead Code file(s)`);
      const loss = 100 - archScore;
      reasons.architecture = `-${loss} pts: ${parts.join(', ') || 'AST complexity & module coupling'}`;
    }

    // 2. Security Reason
    const secScore = metrics.security || 100;
    if (secScore === 100) {
      reasons.security = "100% Clean: Zero SAST vulnerabilities & secrets detected";
    } else {
      const parts = [];
      if (summary.sastVulnerabilities > 0) parts.push(`${summary.sastVulnerabilities} SAST Flaw(s)`);
      if (summary.supplyChainRisks > 0) parts.push(`${summary.supplyChainRisks} Supply Chain Risk(s)`);
      const loss = 100 - secScore;
      reasons.security = `-${loss} pts: ${parts.join(', ') || 'Security vulnerabilities detected'}`;
    }

    // 3. Code Quality Reason
    const qualScore = metrics.codeQuality || 100;
    if (qualScore === 100) {
      reasons.codeQuality = "100% Clean: Optimal AST complexity across all modules";
    } else {
      const largeFiles = nodes.filter(n => n.lines > 300).length;
      const giantFiles = nodes.filter(n => n.lines > 600).length;
      const loss = 100 - qualScore;
      const parts = [];
      if (giantFiles > 0) parts.push(`${giantFiles} giant file(s) >600 LOC`);
      if (largeFiles > 0) parts.push(`${largeFiles} large file(s) >300 LOC`);
      reasons.codeQuality = `-${loss} pts: ${parts.join(', ') || 'High file LOC & AST complexity'}`;
    }

    // 4. AI Readiness Reason
    const aiScore = metrics.aiReadiness || 100;
    if (aiScore === 100) {
      reasons.aiReadiness = "100% Clean: Full symbol coverage & active memory rules";
    } else {
      const loss = 100 - aiScore;
      reasons.aiReadiness = `-${loss} pts: Missing persistent architectural rules or ADRs`;
    }

    // 5. UI Architecture Reason
    if (metrics.uiArchitecture !== null) {
      const uiScore = metrics.uiArchitecture;
      if (uiScore === 100) {
        reasons.uiArchitecture = "100% Clean: Decoupled UI composition & zero 'use client' leaks";
      } else {
        const loss = 100 - uiScore;
        reasons.uiArchitecture = `-${loss} pts: Oversized UI components (>400 LOC) or 'use client' leaks`;
      }
    }

    return reasons;
  }

  getRefactorSafety() {
    const summary = this.healthResult.summary || {};
    const violations = summary.constitutionViolations || 0;
    const cycles = summary.circularDependencyCycles || 0;
    const sast = summary.sastVulnerabilities || 0;
    const godComp = summary.godComponentsCount || 0;

    const safetyScore = Math.max(40, Math.min(100, 100 - (violations * 10 + cycles * 15 + sast * 10 + godComp * 5)));
    let statusMsg = "Safe for AI-assisted refactoring";
    if (safetyScore < 70) statusMsg = "Requires manual developer review before AI refactoring";

    return {
      score: `${safetyScore}%`,
      statusMsg
    };
  }

  getRepositoryInsights() {
    const nodes = this.graphData.nodes || [];
    let largestModule = 'None';
    let maxLines = 0;
    let mostConnected = 'None';
    let maxDegree = 0;

    const degreeMap = new Map();
    (this.graphData.edges || []).forEach(e => {
      degreeMap.set(e.source, (degreeMap.get(e.source) || 0) + 1);
      degreeMap.set(e.target, (degreeMap.get(e.target) || 0) + 1);
    });

    nodes.forEach(n => {
      if (n.lines > maxLines) {
        maxLines = n.lines;
        largestModule = n.name;
      }
      const deg = degreeMap.get(n.id) || 0;
      if (deg > maxDegree) {
        maxDegree = deg;
        mostConnected = n.name;
      }
    });

    const summary = this.healthResult.summary || {};

    return {
      largestModule: `${largestModule} (${maxLines} lines)`,
      mostConnectedModule: `${mostConnected} (${maxDegree} dependencies)`,
      circularDependencies: summary.circularDependencyCycles || 0,
      deadCodeFiles: summary.deadCodeFilesCount || 0
    };
  }

  getTopRecommendations() {
    const summary = this.healthResult.summary || {};
    const metrics = this.healthResult.metrics || {};
    const recommendations = [];

    if ((summary.constitutionViolations || 0) > 0) {
      recommendations.push({
        priority: 'HIGH',
        action: `Resolve ${summary.constitutionViolations} Layer Boundary Violation(s)`,
        estimatedGain: '+15 Architecture',
        estimatedTime: '~35 mins',
        command: 'architectos review'
      });
    }

    if ((summary.circularDependencyCycles || 0) > 0) {
      recommendations.push({
        priority: 'HIGH',
        action: `Break ${summary.circularDependencyCycles} Circular Import Cycle(s)`,
        estimatedGain: '+10 Architecture',
        estimatedTime: '~20 mins',
        command: 'architectos fix-plan'
      });
    }

    if (metrics.aiReadiness < 90) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Generate ADRs & Repository Memory Rules',
        estimatedGain: '+15 AI Readiness',
        estimatedTime: '~15 mins',
        command: 'architectos remember "Domain layer is source of truth"'
      });
    }

    if ((summary.godComponentsCount || 0) > 0) {
      recommendations.push({
        priority: 'LOW',
        action: `Decompose ${summary.godComponentsCount} God Component(s) (>15 dependencies)`,
        estimatedGain: '+5 Maintainability',
        estimatedTime: '~45 mins',
        command: 'architectos fix-plan'
      });
    }

    return recommendations;
  }
}

module.exports = RepositoryAnalysisEngine;

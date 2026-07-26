/**
 * ArchitectOS Layer 13: Repository Analysis Engine
 * Computes transparent inline score reasons, Refactor Safety %,
 * compact Repository Insights, and Top Recommendations.
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
   * Transparent Inline Score Reasons (Why points were deducted)
   */
  getScoreReasons() {
    const summary = this.healthResult.summary || {};
    const metrics = this.healthResult.metrics || {};
    const reasons = {};

    // 1. Architecture Reason
    const archViolations = summary.constitutionViolations || 0;
    const cycles = summary.circularDependencyCycles || 0;
    const godComp = summary.godComponentsCount || 0;
    if (archViolations === 0 && cycles === 0 && godComp === 0) {
      reasons.architecture = "Clean domain boundaries & DAG graph integrity";
    } else {
      const parts = [];
      if (archViolations > 0) parts.push(`${archViolations} Layer Violation(s)`);
      if (cycles > 0) parts.push(`${cycles} Cycle(s)`);
      if (godComp > 0) parts.push(`${godComp} God Component(s)`);
      reasons.architecture = parts.join(', ');
    }

    // 2. Security Reason
    const sast = summary.sastVulnerabilities || 0;
    const supplyChain = summary.supplyChainRisks || 0;
    if (sast === 0 && supplyChain === 0) {
      reasons.security = "Zero SAST vulnerabilities & secrets detected";
    } else {
      const parts = [];
      if (sast > 0) parts.push(`${sast} SAST Flaw(s)`);
      if (supplyChain > 0) parts.push(`${supplyChain} Supply Chain Risk(s)`);
      reasons.security = parts.join(', ');
    }

    // 3. AI Readiness Reason
    if (metrics.aiReadiness >= 90) {
      reasons.aiReadiness = "100% Symbol coverage & active memory rules";
    } else {
      reasons.aiReadiness = "Missing persistent memory rules or ADRs";
    }

    // 4. Code Quality Reason
    reasons.codeQuality = "Evaluated across AST complexity & file sizes";

    // 5. Testability Reason
    reasons.testability = "Evaluated against valid assertion test files";

    // 6. Maintainability Reason
    const deadCode = summary.deadCodeFilesCount || 0;
    if (deadCode === 0) {
      reasons.maintainability = "Optimal component modularity & low debt";
    } else {
      reasons.maintainability = `${deadCode} Dead Code file(s) detected`;
    }

    return reasons;
  }

  /**
   * Refactor Safety Rating (%)
   */
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

  /**
   * Compact Repository Insights (4 Lines)
   */
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

  /**
   * Prioritized Top Recommendations (with Estimated Gain & Estimated Time)
   */
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

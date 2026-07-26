/**
 * ArchitectOS Layer 13: Repository Intelligence Engine
 * Computes the signature Repository IQ (0-100), Risk Engine, Refactor Safety Rating (%),
 * Repository Insights (Largest Module, God Object, Dead APIs), and Prioritized Next Best Actions.
 */
const fs = require('fs');
const path = require('path');

class IntelligenceEngine {
  constructor(graphData, healthResult, targetDir = process.cwd()) {
    this.graphData = graphData;
    this.healthResult = healthResult;
    this.targetDir = targetDir;
  }

  /**
   * Signature Metric: Repository IQ (0 - 100)
   * Evaluates Architecture, Consistency, Discoverability, Context Quality, and AI Efficiency.
   */
  calculateRepositoryIQ() {
    const metrics = this.healthResult.metrics || {};
    const summary = this.healthResult.summary || {};

    const archScore = metrics.architecture || 80;
    const consistencyScore = Math.max(50, Math.min(100, 100 - (summary.deadCodeFilesCount || 0) * 2 - (summary.godComponentsCount || 0) * 5));
    const discoverabilityScore = Math.max(50, Math.min(100, Math.round(((summary.totalCodeFiles - (summary.deadCodeFilesCount || 0)) / Math.max(1, summary.totalCodeFiles)) * 100)));
    const contextQualityScore = metrics.aiReadiness || 85;
    const aiEfficiencyScore = Math.max(40, Math.min(100, Math.round((contextQualityScore * 0.6 + archScore * 0.4))));

    const overallIQ = Math.round(
      archScore * 0.25 +
      consistencyScore * 0.20 +
      discoverabilityScore * 0.20 +
      contextQualityScore * 0.20 +
      aiEfficiencyScore * 0.15
    );

    return {
      overallIQ,
      dimensions: {
        architecture: archScore,
        consistency: consistencyScore,
        discoverability: discoverabilityScore,
        contextQuality: contextQualityScore,
        aiEfficiency: aiEfficiencyScore
      }
    };
  }

  /**
   * Risk Engine & Refactor Safety Rating (%)
   */
  calculateRiskEngine() {
    const summary = this.healthResult.summary || {};
    const violations = summary.constitutionViolations || 0;
    const cycles = summary.circularDependencyCycles || 0;
    const sast = summary.sastVulnerabilities || 0;

    let archDrift = 'LOW';
    if (violations > 3 || cycles > 2) archDrift = 'HIGH';
    else if (violations > 0 || cycles > 0) archDrift = 'MEDIUM';

    let mergeRisk = 'LOW';
    if (sast > 2 || violations > 2) mergeRisk = 'HIGH';
    else if (sast > 0 || violations > 0) mergeRisk = 'MEDIUM';

    let regressionRisk = 'LOW';
    if (cycles > 0 || (summary.godComponentsCount || 0) > 3) regressionRisk = 'HIGH';
    else if ((summary.godComponentsCount || 0) > 0) regressionRisk = 'MEDIUM';

    // Refactor Safety Score (% safe for autonomous AI refactoring)
    const refactorSafety = Math.max(40, Math.min(100, 100 - (violations * 10 + cycles * 15 + sast * 10 + (summary.godComponentsCount || 0) * 5)));

    return {
      archDrift,
      mergeRisk,
      regressionRisk,
      refactorSafetyScore: `${refactorSafety}%`
    };
  }

  /**
   * Repository Insights (Largest Module, Most Connected, Dead APIs, Orphan Components)
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
      mostConnectedComponent: `${mostConnected} (${maxDegree} connections)`,
      orphanComponentsCount: summary.deadCodeFilesCount || 0,
      supplyChainRisksCount: summary.supplyChainRisks || 0
    };
  }

  /**
   * Prioritized Next Best Actions (HIGH / MEDIUM / LOW)
   */
  getPrioritizedNextBestActions() {
    const summary = this.healthResult.summary || {};
    const metrics = this.healthResult.metrics || {};
    const actions = [];

    if ((summary.constitutionViolations || 0) > 0) {
      actions.push({
        priority: 'HIGH',
        action: `Fix ${summary.constitutionViolations} Layer Boundary Violation(s)`,
        estimatedGain: '+15 pts Architecture',
        command: 'architectos fix ui-infrastructure-boundary'
      });
    }

    if ((summary.circularDependencyCycles || 0) > 0) {
      actions.push({
        priority: 'HIGH',
        action: `Break ${summary.circularDependencyCycles} Circular Import Cycle(s)`,
        estimatedGain: '+10 pts Architecture',
        command: 'architectos fix-plan'
      });
    }

    if (metrics.aiReadiness < 90) {
      actions.push({
        priority: 'MEDIUM',
        action: 'Record persistent architecture memory rules & generate ADRs',
        estimatedGain: '+15 pts AI Readiness',
        command: 'architectos remember "Domain layer is source of truth"'
      });
    }

    if ((summary.godComponentsCount || 0) > 0) {
      actions.push({
        priority: 'LOW',
        action: `Decompose ${summary.godComponentsCount} God Component(s) (>15 dependencies)`,
        estimatedGain: '+5 pts Maintainability',
        command: 'architectos fix-plan'
      });
    }

    return actions;
  }
}

module.exports = IntelligenceEngine;

/**
 * ArchitectOS Layer 12: Historical Trend Tracking Engine
 * Persists repository health snapshots in .architectos/history.json
 * and calculates trend deltas (▲ +2, ▼ -1, =) across runs.
 */
const fs = require('fs');
const path = require('path');

class HistoryEngine {
  constructor(targetDir = process.cwd()) {
    this.targetDir = targetDir;
    this.historyDir = path.join(targetDir, '.architectos');
    this.historyFile = path.join(this.historyDir, 'history.json');
  }

  loadHistory() {
    try {
      if (fs.existsSync(this.historyFile)) {
        const raw = fs.readFileSync(this.historyFile, 'utf-8');
        return JSON.parse(raw) || [];
      }
    } catch (e) {}
    return [];
  }

  saveSnapshot(healthMetrics) {
    try {
      if (!fs.existsSync(this.historyDir)) {
        fs.mkdirSync(this.historyDir, { recursive: true });
      }
      const history = this.loadHistory();
      const snapshot = {
        timestamp: new Date().toISOString(),
        overallScore: healthMetrics.overallScore,
        metrics: healthMetrics.metrics
      };
      history.push(snapshot);

      // Keep last 50 snapshots
      if (history.length > 50) history.shift();

      fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
    } catch (e) {}
  }

  getTrendDeltas(currentMetrics) {
    const history = this.loadHistory();
    if (history.length === 0) {
      return {
        overall: '=',
        architecture: '=',
        security: '=',
        maintainability: '=',
        testability: '=',
        aiReadiness: '='
      };
    }

    const prev = history[history.length - 1];
    const prevMetrics = prev.metrics || {};

    const calcDelta = (currVal, prevVal) => {
      if (prevVal === undefined || currVal === prevVal) return '=';
      const diff = currVal - prevVal;
      return diff > 0 ? `▲ +${diff}` : `▼ ${diff}`;
    };

    return {
      overall: calcDelta(currentMetrics.overallScore, prev.overallScore),
      architecture: calcDelta(currentMetrics.metrics.architecture, prevMetrics.architecture),
      security: calcDelta(currentMetrics.metrics.security, prevMetrics.security),
      maintainability: calcDelta(currentMetrics.metrics.maintainability, prevMetrics.maintainability),
      testability: calcDelta(currentMetrics.metrics.testability, prevMetrics.testability),
      aiReadiness: calcDelta(currentMetrics.metrics.aiReadiness, prevMetrics.aiReadiness)
    };
  }
}

module.exports = HistoryEngine;

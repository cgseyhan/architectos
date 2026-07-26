const { calculateHealth } = require('../src/graph/health');

describe('ArchitectOS Engineering Health Scorer Tests', () => {
  test('should calculate 100/100 for clean repository graph', () => {
    const mockGraphData = {
      nodes: [
        { id: 'app.js', name: 'app.js', path: 'app.js', domain: 'API', lines: 50, symbols: [{ name: 'main' }] },
        { id: 'service.js', name: 'service.js', path: 'service.js', domain: 'Domain', lines: 80, symbols: [{ name: 'Service' }] }
      ],
      edges: [{ id: 'app.js->service.js', source: 'app.js', target: 'service.js' }],
      cycles: [],
      violations: []
    };

    const health = calculateHealth(mockGraphData);
    expect(health.overallScore).toBeGreaterThanOrEqual(80);
    expect(health.metrics.architecture).toBe(100);
    expect(health.metrics.security).toBe(100);
    expect(health.metrics.technicalDebtHours).toBeDefined();
  });

  test('should penalize layer boundary violations and circular cycles', () => {
    const mockGraphData = {
      nodes: [
        { id: 'ui.js', name: 'ui.js', path: 'ui.js', domain: 'UI', lines: 100, symbols: [{ name: 'Component' }] },
        { id: 'db.js', name: 'db.js', path: 'db.js', domain: 'Infrastructure', lines: 150, symbols: [{ name: 'Repo' }] }
      ],
      edges: [{ id: 'ui.js->db.js', source: 'ui.js', target: 'db.js' }],
      cycles: [['ui.js', 'db.js']],
      violations: [{ ruleId: 'ui-infrastructure-boundary', message: 'UI directly imports DB' }]
    };

    const health = calculateHealth(mockGraphData);
    expect(health.metrics.architecture).toBeLessThan(100);
    expect(health.debtBreakdown.length).toBeGreaterThan(0);
    expect(health.metrics.technicalDebtHours).not.toBe('0 mins (Clean)');
  });
});

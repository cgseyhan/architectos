const RepositoryAnalysisEngine = require('../src/graph/analysis');

describe('ArchitectOS RepositoryAnalysisEngine Tests', () => {
  test('should generate transparent score deduction reasons and Refactor Safety %', () => {
    const mockGraphData = { nodes: [], edges: [], cycles: [], violations: [] };
    const mockHealthResult = {
      overallScore: 92,
      metrics: { architecture: 96, security: 94, codeQuality: 90, aiReadiness: 97, testability: 88, maintainability: 89 },
      summary: { totalFiles: 10, totalCodeFiles: 8, constitutionViolations: 0, circularDependencyCycles: 0, sastVulnerabilities: 0, godComponentsCount: 0, deadCodeFilesCount: 0 }
    };

    const analysis = new RepositoryAnalysisEngine(mockGraphData, mockHealthResult);
    const scoreReasons = analysis.getScoreReasons();
    const safety = analysis.getRefactorSafety();
    const insights = analysis.getRepositoryInsights();

    expect(scoreReasons.architecture).toBeDefined();
    expect(safety.score).toBe('100%');
    expect(insights.largestModule).toBeDefined();
  });
});

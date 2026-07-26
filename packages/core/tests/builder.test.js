const path = require('path');
const GraphBuilder = require('../src/graph/builder');

describe('ArchitectOS GraphBuilder AST Tests', () => {
  test('should scan directory and extract AST symbol nodes and edges', () => {
    const targetDir = path.resolve(__dirname, '../src');
    const builder = new GraphBuilder(targetDir, { architecture: { rules: [] } });
    const graphData = builder.scan();

    expect(graphData.nodes.length).toBeGreaterThan(0);
    expect(graphData.stats.totalFiles).toBeGreaterThan(0);
  });
});

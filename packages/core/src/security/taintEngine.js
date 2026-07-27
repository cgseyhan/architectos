/**
 * ArchitectOS Taint Engine
 * Traces untrusted data flow from Sources to Sinks across multi-file import graphs.
 */

const fs = require('fs');
const path = require('path');
const { TAINT_SOURCES } = require('./sourceRegistry');
const { TAINT_SINKS } = require('./sinkRegistry');

function analyzeTaint(targetFile, graphData, targetDir = process.cwd()) {
  const { nodes, edges } = graphData || { nodes: [], edges: [] };
  const taintPaths = [];

  const targetNode = nodes.find(n => n.name.toLowerCase() === targetFile.toLowerCase() || n.path.toLowerCase().includes(targetFile.toLowerCase()));

  const nodesToScan = targetNode ? [targetNode] : nodes.slice(0, 30);

  nodesToScan.forEach(node => {
    if (!node.path || !/\.(js|jsx|ts|tsx)$/i.test(node.path)) return;

    try {
      const fullPath = path.isAbsolute(node.path) ? node.path : path.join(targetDir, node.path);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((lineText, idx) => {
          const trimmed = lineText.trim();
          if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

          // Check if line contains a Source
          const detectedSource = TAINT_SOURCES.find(s => s.pattern.test(lineText));
          if (!detectedSource) return;

          // Check downstream imports from this node
          const downstreamEdges = edges.filter(e => e.source === node.id);

          downstreamEdges.forEach(edge => {
            const destNode = nodes.find(n => n.id === edge.target);
            if (!destNode) return;

            try {
              const destPath = path.isAbsolute(destNode.path) ? destNode.path : path.join(targetDir, destNode.path);
              if (fs.existsSync(destPath)) {
                const destContent = fs.readFileSync(destPath, 'utf-8');
                const destLines = destContent.split('\n');

                destLines.forEach((destLine, destIdx) => {
                  const destSink = TAINT_SINKS.find(s => s.pattern.test(destLine));
                  if (destSink) {
                    taintPaths.push({
                      source: detectedSource.name,
                      category: destSink.category,
                      sourceFile: node.path,
                      sourceLine: idx + 1,
                      sinkFile: destNode.path,
                      sinkLine: destIdx + 1,
                      sinkName: destSink.name,
                      confidence: 'HIGH',
                      hopsCount: 2,
                      recommendation: `Sanitize input from ${detectedSource.name} before passing to ${destSink.name} at ${destNode.name}:${destIdx + 1}.`
                    });
                  }
                });
              }
            } catch (e) {}
          });
        });
      }
    } catch (e) {}
  });

  return {
    target: targetFile || 'All Entrypoints',
    detectedPathsCount: taintPaths.length,
    taintPaths,
  };
}

module.exports = { analyzeTaint };

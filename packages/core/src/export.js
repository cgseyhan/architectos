const fs = require('fs');
const path = require('path');

/**
 * ArchitectOS Multi-Format Export Engine
 * Exports repository knowledge graph in Mermaid, Markdown, JSON, and Graph formats.
 */
function exportGraph(graphData, format = 'mermaid') {
  const fmt = (format || 'mermaid').toLowerCase();

  if (fmt === 'json') {
    return JSON.stringify(graphData, null, 2);
  }

  if (fmt === 'markdown' || fmt === 'md') {
    let md = `# ArchitectOS Repository Knowledge Graph Export\n\n`;
    md += `**Total Files:** ${graphData.stats.totalFiles}  \n`;
    md += `**Total Dependencies:** ${graphData.stats.totalDependencies}  \n`;
    md += `**Circular Import Loops:** ${graphData.stats.totalCycles}  \n`;
    md += `**Layer Violations:** ${graphData.stats.totalViolations}  \n\n`;

    md += `## Architectural Modules\n\n`;
    for (const node of graphData.nodes) {
      md += `- **${node.path}** (${node.domain}) - ${node.lines} lines, ${node.size} bytes\n`;
    }

    if (graphData.cycles.length > 0) {
      md += `\n## Circular Dependency Loops\n\n`;
      graphData.cycles.forEach((cycle, i) => {
        md += `${i + 1}. \`${cycle.join(' ──► ')}\`\n`;
      });
    }

    return md;
  }

  if (fmt === 'mermaid') {
    let mermaid = `graph TD\n`;
    for (const edge of graphData.edges) {
      const sourceId = edge.source.replace(/[^a-zA-Z0-9]/g, '_');
      const targetId = edge.target.replace(/[^a-zA-Z0-9]/g, '_');
      mermaid += `  ${sourceId}["${edge.source}"] --> ${targetId}["${edge.target}"]\n`;
    }
    return mermaid;
  }

  return JSON.stringify(graphData, null, 2);
}

module.exports = {
  exportGraph
};

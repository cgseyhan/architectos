/**
 * ArchitectOS Layer 8: Heterogeneous Cross-Graph Impact Engine
 * Dynamically computes change blast radius & affected subsystems from AST graph edges.
 */

function analyzeImpact(target, graphData) {
  const normTarget = target.replace(/\\/g, '/').toLowerCase();
  const { nodes, edges } = graphData;

  const directDependents = [];
  const transitiveDependents = new Set();
  const affectedSubsystems = new Set();

  const isVendor = (str) => /node_modules|react|next|axios|zod|express|fastify|lodash/i.test(str);

  for (const edge of edges) {
    if (isVendor(edge.source) || isVendor(edge.target)) continue;
    if (edge.target.toLowerCase().includes(normTarget) || edge.source.toLowerCase().includes(normTarget)) {
      directDependents.push(edge.source);
      transitiveDependents.add(edge.source);
      transitiveDependents.add(edge.target);

      // Infer subsystem from file path
      const sourceNode = nodes.find(n => n.id === edge.source);
      if (sourceNode) {
        const parts = sourceNode.path.split(/[\/\\]/);
        if (parts.length > 1) affectedSubsystems.add(parts[0] !== 'src' ? parts[0] : (parts[1] || 'Core'));
      }
    }
  }

  if (affectedSubsystems.size === 0) {
    affectedSubsystems.add('Core Subsystem');
  }

  // Signature-Aware Impact Analysis
  const targetNode = nodes.find(n => n.path.toLowerCase().includes(normTarget));
  const isPublicInterface = targetNode && (
    targetNode.symbols.some(s => typeof s === 'string' ? /interface|type|export/i.test(s) : /interface|type|export/i.test(s.kind || s.name)) ||
    /(service|repository|api|interface|types)/i.test(targetNode.name)
  );

  const signatureType = isPublicInterface ? 'PUBLIC_EXPORTED_API' : 'INTERNAL_HELPER_LOGIC';
  const totalAffectedFiles = transitiveDependents.size || directDependents.length;
  const riskLevel = isPublicInterface ? (totalAffectedFiles > 10 ? 'HIGH' : 'MEDIUM') : (totalAffectedFiles > 20 ? 'HIGH' : 'LOW');

  return {
    target: target,
    signatureType,
    affectedSubsystems: Array.from(affectedSubsystems),
    affectedFilesCount: totalAffectedFiles,
    riskLevel,
    directDependents
  };
}

module.exports = {
  analyzeImpact
};

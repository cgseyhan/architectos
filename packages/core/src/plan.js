/**
 * ArchitectOS Layer 15: AI Refactoring Planner (architectos plan)
 * Dynamically computes refactoring steps from AST graph nodes.
 */

function generateRefactoringPlan(target, graphData) {
  const { nodes } = graphData || { nodes: [] };
  const baseName = target.replace(/\.[^/.]+$/, '').replace(/\\/g, '/').split('/').pop();
  const cleanTarget = baseName || target;

  const targetNode = nodes.find(n => n.path.toLowerCase().includes(target.toLowerCase()));
  const targetDomain = targetNode ? targetNode.domain : 'Domain';

  const steps = [
    `Extract ${cleanTarget}Context / State`,
    `Move data access layer into ${cleanTarget}${targetDomain !== 'Domain' ? targetDomain : 'Service'}`,
    `Update downstream imports across graph`,
    `Run architectos review`
  ];

  return {
    target: target,
    estimatedTime: `${Math.min(60, Math.max(15, (targetNode ? targetNode.lines : 300) / 10))} min`,
    steps
  };
}

module.exports = {
  generateRefactoringPlan
};

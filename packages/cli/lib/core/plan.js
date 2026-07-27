/**
 * ArchitectOS Layer 15: AI Refactoring Planner (architectos plan)
 */

function generateRefactoringPlan(target, graphData) {
  const baseName = target.replace(/\.[^/.]+$/, '').replace(/\\/g, '/').split('/').pop();
  const cleanTarget = baseName || target;

  const steps = [
    `Extract ${cleanTarget}Context`,
    `Move Repository access into WorkspaceService`,
    `Update imports`,
    `Run architectos review`
  ];

  return {
    target: target,
    estimatedTime: "40 min",
    steps
  };
}

module.exports = {
  generateRefactoringPlan
};

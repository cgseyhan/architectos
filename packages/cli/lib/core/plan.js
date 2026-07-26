/**
 * ArchitectOS Layer 15: AI Refactoring Planner (architectos plan)
 */

function generateRefactoringPlan(topic, graphData) {
  const normTopic = topic.toLowerCase();

  const steps = [
    {
      step: 1,
      name: "Extract Domain Core & Interfaces",
      description: "Isolate pure business entities and declare repository/service port interfaces.",
      targetFiles: graphData.nodes.filter(n => n.domain.includes('Domain')).map(n => n.path)
    },
    {
      step: 2,
      name: "Decouple Infrastructure & Adapters",
      description: "Wrap external APIs, databases, and third-party SDKs behind port implementations.",
      targetFiles: graphData.nodes.filter(n => n.domain.includes('Infrastructure') || n.domain.includes('API')).map(n => n.path)
    },
    {
      step: 3,
      name: "Enforce Architectural Boundaries",
      description: "Configure ArchitectOS constitution rules to forbid direct UI-to-Infrastructure imports.",
      targetFiles: ["architectos.config.json"]
    }
  ];

  return {
    planTitle: `Refactoring Plan: ${topic}`,
    estimatedHours: 8,
    riskLevel: "Low",
    totalSteps: steps.length,
    executionPlan: steps
  };
}

module.exports = {
  generateRefactoringPlan
};

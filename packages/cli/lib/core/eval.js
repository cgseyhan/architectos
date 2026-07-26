/**
 * ArchitectOS AI Evaluation Engine (Context Score & Hallucination Risk)
 */

function evaluateAiContext(bundle, fullGraph) {
  const selectedCount = bundle.contextBundle.nodes.length;
  const totalCount = fullGraph.nodes.length || 1;

  const completenessRatio = Math.min(1.0, selectedCount / (totalCount * 0.7));
  const completenessPercent = Math.round(completenessRatio * 100);

  const missingFiles = Math.max(0, totalCount - selectedCount);
  const missingSymbols = fullGraph.nodes.reduce((acc, n) => {
    const isSelected = bundle.contextBundle.nodes.some(sn => sn.id === n.id);
    return acc + (isSelected ? 0 : (n.symbols ? n.symbols.length : 0));
  }, 0);

  let hallucinationRisk = 'Low';
  if (completenessPercent < 40) hallucinationRisk = 'High';
  else if (completenessPercent < 75) hallucinationRisk = 'Medium';

  return {
    aiContextScore: Math.round(completenessPercent * 0.9 + 10),
    contextCompletenessPercent: `${completenessPercent}%`,
    missingFiles,
    missingSymbols,
    hallucinationRisk,
    details: {
      budgetUsed: bundle.estimatedTokenCount,
      tokenLimit: bundle.tokenBudget
    }
  };
}

module.exports = {
  evaluateAiContext
};

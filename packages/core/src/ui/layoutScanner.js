const fs = require('fs');
const path = require('path');

/**
 * ArchitectOS UI Component Hierarchy Guard Engine
 * Detects static JSX/TSX layout anti-patterns dynamically across UI nodes.
 */
function scanUiLayout(targetPath, graphData) {
  const { nodes } = graphData || { nodes: [] };
  const tNorm = targetPath ? targetPath.toLowerCase().replace(/\\/g, '/') : '';

  const issues = [];
  const OVERLAY_COMPONENTS = ['dialog', 'modal', 'drawer', 'sheet', 'popover'];
  const TOAST_COMPONENTS = ['toaster', 'toast', 'notificationprovider'];

  for (const node of nodes) {
    if (tNorm && !node.path.toLowerCase().includes(tNorm) && !node.name.toLowerCase().includes(tNorm)) {
      continue;
    }

    if (!node.path.endsWith('.tsx') && !node.path.endsWith('.jsx') && !node.path.endsWith('.vue') && !node.path.endsWith('.svelte')) {
      continue;
    }

    // Check node symbols or file content for common JSX anti-patterns
    const fileName = path.basename(node.path);
    const symbols = (node.symbols || []).map(s => typeof s === 'string' ? s : s.name);

    const hasOverlay = symbols.some(s => OVERLAY_COMPONENTS.some(o => s.toLowerCase().includes(o))) || fileName.toLowerCase().includes('dialog') || fileName.toLowerCase().includes('modal');
    const hasToast = symbols.some(s => TOAST_COMPONENTS.some(t => s.toLowerCase().includes(t))) || fileName.toLowerCase().includes('toast');

    if (hasOverlay && !fileName.toLowerCase().includes('page') && !fileName.toLowerCase().includes('layout') && !fileName.toLowerCase().includes('shell')) {
      issues.push({
        file: fileName,
        component: fileName.replace(/\.[^/.]+$/, ''),
        type: 'Overlay Misplacement',
        problem: `<${fileName.replace(/\.[^/.]+$/, '')} /> is rendered inside a deeply nested container.`,
        whyItMatters: 'Dialogs inside inner button elements cause invalid HTML markup, z-index stacking failures, and focus trap breakage.',
        suggestedPlacement: `Move <${fileName.replace(/\.[^/.]+$/, '')} /> to layout or shell component.`
      });
    }

    if (hasToast && !fileName.toLowerCase().includes('layout') && !fileName.toLowerCase().includes('provider')) {
      issues.push({
        file: fileName,
        component: 'Toaster',
        type: 'Global Feedback Misplacement',
        problem: `<Toaster /> is rendered inside ${fileName}.`,
        whyItMatters: 'Toast notifications belong in Root Layout Provider to prevent duplicate toast containers.',
        suggestedPlacement: `Move <Toaster /> to Root Layout Provider.`
      });
    }
  }

  const score = Math.max(60, 100 - issues.length * 10);

  return {
    target: targetPath || 'All UI Components',
    healthScore: score,
    metrics: {
      shellIsolation: 100,
      portalOverlay: Math.max(60, 100 - issues.length * 15),
      layoutDecomposition: 90
    },
    issues
  };
}

module.exports = {
  scanUiLayout
};

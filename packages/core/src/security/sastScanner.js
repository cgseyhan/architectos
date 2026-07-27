/**
 * ArchitectOS High-Precision SAST Engine v1.2.0
 * Context-aware Static Application Security Testing with:
 *  - 25 CWE-mapped vulnerability rules (via ruleRegistry.js)
 *  - Inline suppression directives (architectos-ignore / nosec)
 *  - Sanitizer presence detection (DOMPurify, escapeHtml, etc.)
 *  - Literal-safe classification for false positive reduction
 *  - Self-exclusion: does not scan its own rule definition files
 */

const { SAST_RULES } = require('./ruleRegistry');

// Known sanitizer function names — if present near a flagged line, suppress the alert
const KNOWN_SANITIZERS = [
  'DOMPurify.sanitize', 'sanitizeHtml', 'sanitize', 'escapeHtml',
  'escape', 'encode', 'xss', 'validator.escape', 'striptags',
  'he.encode', 'he.escape', 'purify.sanitize',
];

function scanCodeForVulnerabilities(content, filePath) {
  const vulnerabilities = [];

  // Skip non-production files and the scanner's own rule files
  const normPath = filePath ? String(filePath).replace(/\\/g, '/').toLowerCase() : '';
  if (
    normPath.includes('sinkregistry') ||
    normPath.includes('sourceregistry') ||
    normPath.includes('ruleregistry') ||
    normPath.includes('sastscanner') ||
    /(test|spec|mock|example|\.md|\.d\.ts|openapi\.json|\.json$)/.test(normPath)
  ) {
    return vulnerabilities;
  }

  const lines = content.split('\n');

  lines.forEach((lineText, index) => {
    const trimmed = lineText.trim();

    // ── Skip pure comment lines ─────────────────────────────────────────────
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('*/')
    ) {
      return;
    }

    // ── Inline suppression directives ──────────────────────────────────────
    const prevLine = index > 0 ? lines[index - 1] : '';
    if (
      trimmed.includes('architectos-ignore') ||
      trimmed.includes('nosec') ||
      prevLine.includes('architectos-ignore') ||
      prevLine.includes('nosec')
    ) {
      return;
    }

    // ── Context window: 3 lines before + 4 lines after ────────────────────
    const contextWindow = lines
      .slice(Math.max(0, index - 3), Math.min(lines.length, index + 5))
      .join(' ');

    // ── Test block context filter ──────────────────────────────────────────
    // Suppress alerts inside describe/it/beforeEach test blocks
    const isInsideTestBlock = /(?:describe\s*\(|it\s*\(|test\s*\(|beforeEach\s*\(|afterEach\s*\(|beforeAll\s*\(|afterAll\s*\()/.test(contextWindow);

    // ── Dead branch filter ─────────────────────────────────────────────────
    // Suppress alerts inside if (false) or if (ENABLE_X === false) blocks
    const isDeadBranch = /if\s*\(\s*(?:false|0|null|undefined|ENABLE_\w+\s*(?:===|==)\s*false)\s*\)/.test(contextWindow);

    // ── NODE_ENV=test guard ────────────────────────────────────────────────
    const isTestEnvBlock = /process\.env\.NODE_ENV\s*(?:===|==)\s*['"](?:test|development)['"]/.test(contextWindow);

    if (isInsideTestBlock || isDeadBranch || isTestEnvBlock) {
      return;
    }

    for (const rule of SAST_RULES) {
      if (!rule.pattern.test(lineText)) continue;

      // ── Literal-safe check (e.g. innerHTML = '<p></p>' is safe) ───────────
      if (rule.isLiteralSafe) {
        const isStaticLiteral =
          /innerHTML\s*=\s*[`'"].*?[`'"];?$/i.test(trimmed) && !trimmed.includes('${');
        if (isStaticLiteral) continue;
      }

      // ── Sanitizer presence check ──────────────────────────────────────────
      const hasSanitizer = KNOWN_SANITIZERS.some(s => contextWindow.includes(s));
      if (hasSanitizer && rule.isLiteralSafe) continue;

      vulnerabilities.push({
        ruleId: rule.id,
        name: rule.name,
        severity: rule.severity,
        cwe: rule.cwe,
        category: rule.category || 'General',
        confidence: '100%',
        reason: `Matched SAST rule: ${rule.name} (${rule.cwe})`,
        line: index + 1,
        snippet: trimmed.substring(0, 120),
      });
    }
  });

  return vulnerabilities;
}

module.exports = {
  SAST_RULES,
  scanCodeForVulnerabilities,
};

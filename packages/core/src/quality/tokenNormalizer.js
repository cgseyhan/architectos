/**
 * ArchitectOS Token Normalizer
 * Normalizes code snippets into structured token sequences for duplication analysis.
 * Strips comments, string literals, whitespace, and normalizes identifier names.
 */

function tokenize(code) {
  if (!code || typeof code !== 'string') return [];

  // Strip single-line and multi-line comments
  const stripped = code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '');

  const tokens = [];
  // Tokenize regex matching keywords (JS/TS + Python), operators, symbols, numbers, and identifiers
  const tokenRegex = /\b(function|const|let|var|return|if|else|elif|for|while|switch|case|break|continue|try|catch|except|finally|raise|throw|async|await|class|def|import|from|new|this|self|cls|of|in|is|not|and|or|lambda|pass|yield|with|global|nonlocal)\b|([{}()\[\];,.:?])|([+\-*/%&=<>!|^~]+)|("[^"]*"|'[^']*'|`[^`]*`)|(\b\d+\b)|([A-Za-z_$][A-Za-z0-9_$]*)/g;

  let match;
  while ((match = tokenRegex.exec(stripped)) !== null) {
    if (match[1]) {
      tokens.push(`KW:${match[1].toUpperCase()}`);
    } else if (match[2]) {
      tokens.push(`PUNCT:${match[2]}`);
    } else if (match[3]) {
      tokens.push(`OP:${match[3]}`);
    } else if (match[4]) {
      tokens.push('LIT:STR');
    } else if (match[5]) {
      tokens.push('LIT:NUM');
    } else if (match[6]) {
      tokens.push('ID');
    }
  }

  return tokens;
}

module.exports = { tokenize };

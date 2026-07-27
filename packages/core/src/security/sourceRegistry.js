/**
 * ArchitectOS Taint Engine — Source Registry
 * Defines data sources representing untrusted user input across web frameworks.
 */

const TAINT_SOURCES = [
  // Express / Node.js HTTP inputs
  { name: 'req.body', category: 'HTTP_BODY', pattern: /req\.body(?:\.[A-Za-z0-9_$]+)?/i },
  { name: 'req.query', category: 'HTTP_QUERY', pattern: /req\.query(?:\.[A-Za-z0-9_$]+)?/i },
  { name: 'req.params', category: 'HTTP_PARAMS', pattern: /req\.params(?:\.[A-Za-z0-9_$]+)?/i },
  { name: 'req.headers', category: 'HTTP_HEADERS', pattern: /req\.headers(?:\.[A-Za-z0-9_$]+)?/i },

  // Next.js App Router / Page Props
  { name: 'searchParams', category: 'NEXT_QUERY', pattern: /searchParams(?:\.[A-Za-z0-9_$]+|\.get\([^)]+\))?/i },
  { name: 'params', category: 'NEXT_PARAMS', pattern: /params\.[A-Za-z0-9_$]+/i },

  // Client-side DOM inputs
  { name: 'location.search', category: 'DOM_QUERY', pattern: /window\.location\.search|location\.search/i },
  { name: 'location.hash', category: 'DOM_HASH', pattern: /window\.location\.hash|location\.hash/i },
  { name: 'URLSearchParams', category: 'URL_PARAMS', pattern: /new\s+URLSearchParams/i },
];

module.exports = { TAINT_SOURCES };

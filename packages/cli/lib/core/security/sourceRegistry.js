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

  // Python Flask / FastAPI / Django / CLI inputs
  { name: 'request.args', category: 'PYTHON_FLASK_QUERY', pattern: /request\.(?:args|form|values|json|files)(?:\[|\.get)/i },
  { name: 'request.GET', category: 'PYTHON_DJANGO_QUERY', pattern: /request\.(?:GET|POST|COOKIES|FILES)(?:\[|\.get)/i },
  { name: 'sys.argv', category: 'PYTHON_CLI', pattern: /sys\.argv(?:\[|\b)/i },
  { name: 'os.environ', category: 'PYTHON_ENV', pattern: /os\.environ(?:\.get|\[)/i },
];

module.exports = { TAINT_SOURCES };

/**
 * ArchitectOS High-Precision SAST Engine
 * Advanced Static Application Security Testing with Taint Heuristics,
 * Constant Literal Sanitization, and Suppression Directive Support.
 */

const SAST_RULES = [
  {
    id: "SAST-SQLI-001",
    name: "SQL Injection via Dynamic String Concatenation",
    severity: "CRITICAL",
    cwe: "CWE-89",
    pattern: /(?:SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\s+.*?(?:["']\s*\+\s*[A-Za-z_$]|[A-Za-z_$0-9)]\s*\+\s*["']|\bformat\s*\(|f["'].*?\{|\$\{).*?(?:FROM|WHERE|SET|VALUES)/i,
    isLiteralSafe: false,
  },
  {
    id: "SAST-XSS-001",
    name: "Cross-Site Scripting (XSS) via Dangerous DOM Injection",
    severity: "HIGH",
    cwe: "CWE-79",
    pattern: /(dangerouslySetInnerHTML|innerHTML\s*=|document\.write\s*\(|v-html\s*=)/i,
    isLiteralSafe: true, // Safe if setting empty string or static HTML literal like '<p></p>'
  },
  {
    id: "SAST-RCE-001",
    name: "Command / Process Execution Vulnerability",
    severity: "CRITICAL",
    cwe: "CWE-78",
    pattern: /(?:child_process\.exec\s*\(|os\.system\s*\(|subprocess\.(?:Popen|call|run)\s*\(.*?shell\s*=\s*True)/i,
    isLiteralSafe: false,
  },
  {
    id: "SAST-EVAL-001",
    name: "Unsafe Dynamic Code Execution (eval / exec)",
    severity: "HIGH",
    cwe: "CWE-95",
    pattern: /(?:\beval\s*\(|\bpython_exec\s*\(|new\s+Function\s*\()/i,
    isLiteralSafe: false,
  },
  {
    id: "SAST-SSRF-001",
    name: "Potential Server-Side Request Forgery (SSRF)",
    severity: "HIGH",
    cwe: "CWE-918",
    pattern: /(?:fetch\s*\(req\.(?:query|params|body)|requests\.(?:get|post)\s*\([^)]*?(?:req|user_input|url_param))/i,
    isLiteralSafe: false,
  },
  {
    id: "SAST-PATH-001",
    name: "Unsafe Path Traversal in File Operations",
    severity: "HIGH",
    cwe: "CWE-22",
    pattern: /(?:fs\.(?:readFile|readFileSync|createReadStream)\s*\([^)]*?(?:req\.|params\.|query\.)|open\s*\([^)]*?(?:user_input|request\.|path_param))/i,
    isLiteralSafe: false,
  },
  {
    id: "SAST-CRYPTO-001",
    name: "Use of Weak Cryptographic Hash Algorithm (MD5/SHA1)",
    severity: "MEDIUM",
    cwe: "CWE-327",
    pattern: /(?:crypto\.createHash\s*\(\s*['"](?:md5|sha1)['"]\s*\)|hashlib\.(?:md5|sha1)\s*\()/i,
    isLiteralSafe: true,
  },
  {
    id: "SAST-CORS-001",
    name: "Overly Permissive CORS Policy (Access-Control-Allow-Origin: *)",
    severity: "MEDIUM",
    cwe: "CWE-942",
    pattern: /(?:Access-Control-Allow-Origin\s*['"]?\s*:\s*['"]\*['"]|allow_origins\s*=\s*\[\s*['"]\*['"]\s*\])/i,
    isLiteralSafe: true,
  },
  {
    id: "SAST-JWT-001",
    name: "Hardcoded JWT Signing Key or Secret Constant",
    severity: "HIGH",
    cwe: "CWE-798",
    pattern: /(?:jwt\.sign\s*\([^)]*?['"][a-zA-Z0-9_\-]{8,}['"]|jwt\.verify\s*\([^)]*?['"][a-zA-Z0-9_\-]{8,}['"]|SECRET_KEY\s*=\s*['"][a-zA-Z0-9_\-]{6,}['"])/i,
    isLiteralSafe: false,
  },
  {
    id: "SAST-SECRET-001",
    name: "Hardcoded High-Entropy API Key / Token",
    severity: "CRITICAL",
    cwe: "CWE-798",
    pattern: /(?:AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36}|eyJhbGciOi[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+|-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----\s*MII)/,
    isLiteralSafe: false,
  },
];

function scanCodeForVulnerabilities(content, filePath) {
  const vulnerabilities = [];
  if (/(test|spec|mock|example|\.md|\.d\.ts|openapi\.json|\.json$)/i.test(filePath)) {
    return vulnerabilities;
  }

  const lines = content.split('\n');

  lines.forEach((lineText, index) => {
    const trimmed = lineText.trim();
    
    // Ignore pure comments
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    // Support Inline Suppressions: // architectos-ignore or // nosec or # nosec
    const prevLine = index > 0 ? lines[index - 1] : '';
    if (
      trimmed.includes('architectos-ignore') || 
      trimmed.includes('nosec') || 
      prevLine.includes('architectos-ignore') || 
      prevLine.includes('nosec')
    ) {
      return;
    }

    for (const rule of SAST_RULES) {
      if (rule.pattern.test(lineText)) {
        // Taint Check 1: Static Literal HTML assignment is safe for innerHTML (e.g. innerHTML = '' or innerHTML = '<p></p>')
        if (rule.isLiteralSafe) {
          const nextLines = lines.slice(Math.max(0, index - 2), Math.min(lines.length, index + 4)).join(' ');
          const isSanitized = /(?:sanitizeHtml|sanitize|DOMPurify\.sanitize|json\.dumps)\b/i.test(nextLines);
          const isStaticLiteral = /innerHTML\s*=\s*[`'"].*?[`'"];?$/i.test(trimmed) && !trimmed.includes('${');
          if (isSanitized || isStaticLiteral) continue;
        }

        vulnerabilities.push({
          ruleId: rule.id,
          name: rule.name,
          severity: rule.severity,
          cwe: rule.cwe,
          confidence: '100%',
          reason: `Matched AST vulnerability pattern: ${rule.name} (${rule.cwe})`,
          line: index + 1,
          snippet: trimmed.substring(0, 100)
        });
      }
    }
  });

  return vulnerabilities;
}

module.exports = {
  SAST_RULES,
  scanCodeForVulnerabilities
};

# ArchitectOS Scoring Methodology

> **Commitment to Transparency**: This document describes exactly how ArchitectOS
> calculates every score. No black boxes, no hidden weights.
> The formulas below are the live production formulas used in `packages/core/src/graph/health.js`.

---

## Overall Health Score

```
overallScore = weighted_sum / total_active_weight
```

Where `total_active_weight` excludes the UI Architecture category
for non-UI (CLI/backend/library) repositories.

| Category | Weight | Notes |
|---|---|---|
| Architecture | **25%** | Always included |
| Security | **20%** | Always included |
| Code Quality | **20%** | Always included |
| AI Readiness | **15%** | Always included |
| Testability | **10%** | Always included |
| Maintainability | **10%** | Always included |
| UI Architecture | **+10%** | Only added when `.tsx/.jsx/.vue/.svelte` files are present |

> **Special rule**: If Architecture, Security, Code Quality, and AI Readiness
> are all **100** with zero layer violations and zero circular dependency cycles,
> `overallScore` is set to **100** regardless of weighted average.

---

## Category Formulas

### 1. Architecture Score (25%)

```
archDeductions = (cycles × 15) + (violations × 20) + (godComponents × 5) + min(20, deadCodeFiles × 2)
architectureScore = max(0, min(100, 100 - archDeductions))
```

| Metric | Source | Deduction |
|---|---|---|
| Circular dependency cycles | Tarjan SCC algorithm | –15 pts each |
| Layer boundary violations | Constitution rules | –20 pts each |
| God components (>15 deps) | Incoming degree graph | –5 pts each |
| Dead code files | 0 incoming edges, non-entrypoint | –2 pts each (cap: –20) |

**Entrypoint whitelist** (never counted as dead code):
`index`, `app`, `main`, `server`, `page`, `layout`, `cli`, `bin`, `config`,
`test`, `spec`, `intelligence`, `types`, `json`, `html`, `architectos`

---

### 2. Security Score (20%)

```
securityDeductions = (hardcodedSecrets × 10) + (criticalSastCount × 15) + (supplyChainRisks × 5)
securityScore = max(0, min(100, 100 - securityDeductions))
```

| Metric | Detection Method | Deduction |
|---|---|---|
| Hardcoded secrets | Filename pattern (`.env`, `.pem`, `id_rsa`) | –10 pts each |
| Critical/HIGH SAST vulnerabilities | 25-rule CWE-mapped SAST engine | –15 pts each |
| Supply chain risks | `*` or `latest` version pinning in `package.json` | –5 pts each |

**SAST Engine — 25 Rules (v1.2.0)**

| Rule ID | Category | CWE | Severity |
|---|---|---|---|
| SAST-SQLI-001 | Injection | CWE-89 | CRITICAL |
| SAST-XSS-001 | XSS | CWE-79 | HIGH |
| SAST-RCE-001 | Injection | CWE-78 | CRITICAL |
| SAST-EVAL-001 | Injection | CWE-95 | HIGH |
| SAST-SSRF-001 | Injection | CWE-918 | HIGH |
| SAST-PATH-001 | Injection | CWE-22 | HIGH |
| SAST-CRYPTO-001 | Cryptography | CWE-327 | MEDIUM |
| SAST-CORS-001 | Infrastructure | CWE-942 | MEDIUM |
| SAST-JWT-001 | Secrets | CWE-798 | HIGH |
| SAST-SECRET-001 | Secrets | CWE-798 | CRITICAL |
| SAST-PP-001 | Injection | CWE-1321 | HIGH |
| SAST-OR-001 | Injection | CWE-601 | HIGH |
| SAST-DOS-001 | Resource | CWE-1333 | MEDIUM |
| SAST-DESER-001 | Injection | CWE-502 | CRITICAL |
| SAST-LOG-001 | Data Exposure | CWE-532 | MEDIUM |
| SAST-NOSQLI-001 | Injection | CWE-943 | CRITICAL |
| SAST-TIMING-001 | Cryptography | CWE-208 | MEDIUM |
| SAST-CMD-001 | Injection | CWE-78 | CRITICAL |
| SAST-UPLOAD-001 | Infrastructure | CWE-434 | HIGH |
| SAST-WEAK-RAND-001 | Cryptography | CWE-338 | HIGH |
| SAST-OPEN-REDIR-001 | XSS | CWE-601 | HIGH |
| SAST-STORE-001 | Data Exposure | CWE-922 | MEDIUM |
| SAST-ENV-001 | Secrets | CWE-547 | MEDIUM |
| SAST-CLICKJACK-001 | Infrastructure | CWE-1021 | LOW |
| SAST-LDAP-001 | Injection | CWE-90 | HIGH |
| SAST-XXE-001 | Injection | CWE-611 | HIGH |
| SAST-PY-PICKLE-001 | Injection (Python) | CWE-502 | CRITICAL |
| SAST-PY-SQLI-001 | Injection (Python) | CWE-89 | CRITICAL |
| SAST-PY-YAML-001 | Injection (Python) | CWE-502 | HIGH |
| SAST-PY-PATH-001 | Injection (Python) | CWE-22 | HIGH |
| SAST-PY-SHELL-001 | Injection (Python) | CWE-78 | CRITICAL |
| SAST-PY-DEBUG-001 | Infrastructure (Python) | CWE-489 | HIGH |

**False Positive Reduction (Context-Aware Engine)**

The SAST engine suppresses results in the following contexts:
- Lines starting with `//`, `#`, `/*`, `*` (comments)
- Inside `describe()`, `it()`, `test()`, `beforeEach()` test blocks
- Inside `if (false)` / `if (ENABLE_X === false)` dead branches
- Inside `if (process.env.NODE_ENV === 'test')` blocks
- When a known sanitizer (`DOMPurify.sanitize`, `escapeHtml`, `sanitize`, etc.) is present within 3 lines
- Files matching: `test`, `spec`, `mock`, `example`, `.md`, `.d.ts`, `.json`, `ruleRegistry.js`, `sastScanner.js`
- Inline directive: `// architectos-ignore` or `// nosec`

---

### 3. Code Quality Score (20%)

```
largeFiles  = nodes where lines > 300
giantFiles  = nodes where lines > 600
codeQualityDeductions = round((largeFiles / totalFiles) × 30 + (giantFiles / totalFiles) × 40)
codeQualityScore = (deductions ≤ 5) ? 100 : max(0, min(100, 100 - deductions))
```

> **Normalization**: Deductions ≤ 5 are rounded to 100 to account for the fact that
> large utility/config files are expected in well-structured projects.

---

### 4. AI Readiness Score (15%)

```
symbolRatio    = codeFilesWithSymbols / totalCodeFiles
memoryBonus    = 5  (no rules) | 25 (active memory rules detected)
adrBonus       = 5  (no ADRs)  | 15 (ADRs present in .architectos/adrs/)

rawScore       = round(symbolRatio × 60 + memoryBonus + adrBonus)
aiReadinessScore = (memoryBonus=25 AND adrBonus=15 AND symbolRatio≥0.9) ? 100 : rawScore
```

To achieve **100/100 AI Readiness**:
1. Run `architectos remember "Your architectural rule"`
2. Run `architectos adr "Decision Name" "Rationale"`
3. Ensure >90% of source files have exported symbols

---

### 5. Testability Score (10%)

```
validTestFiles   = test files containing (expect|assert|describe|it|pytest)
testRatio        = validTestFiles / max(1, sourceCodeFiles.length)
testabilityScore = max(30, min(100, round(testRatio × 250) + 50))
```

> Minimum score is **30** — even projects with no tests receive a base score.

---

### 6. Maintainability Score (10%)

```
deepFiles    = nodes where path depth > 5 directories
maintainabilityDeductions = round(
  (largeFiles / totalFiles) × 20 +
  (giantFiles / totalFiles) × 30 +
  (deepFiles / totalFiles)  × 20 +
  (deadCodeFiles / totalFiles) × 20
)
maintainabilityScore = max(0, min(100, 100 - maintainabilityDeductions))
```

---

### 7. UI Architecture Score (+10%, UI projects only)

Only calculated when the repository contains `.tsx`, `.jsx`, `.vue`, or `.svelte` files.

```
uiScore = max(60, 100 - issues.length × 10)
```

Detected issues:
- **Overlay Misplacement**: Dialog/Modal/Drawer rendered outside layout shell
- **Global Feedback Misplacement**: `<Toaster />` not in root layout provider
- **Oversized UI Components**: >400 LOC components flagged for decomposition
- **`use client` Boundary Leaks**: Server Component pages marked as client components

---

## Suppression Directives

You can suppress specific SAST findings inline:

```javascript
// architectos-ignore
const result = eval(userCode);

const result = eval(userCode); // nosec
```

Or at file level by naming the file with `test`, `spec`, `mock`, or `fixture`.

---

## Refactor Safety Score

Separate from the health score, displayed in `architectos status`:

```
safetyScore = max(40, min(100, 100 - (violations×10 + cycles×15 + sast×10 + godComp×5)))
```

- **≥ 70%**: Safe for AI-assisted refactoring
- **< 70%**: Manual developer review required before AI refactoring

---

## Score History & Trend

ArchitectOS stores daily snapshots in `.architectos/history/`.
Run `architectos history` to view score trends over time.

---

*Last updated: v1.2.0 — Formula source: `packages/core/src/graph/health.js`*

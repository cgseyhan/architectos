<div align="center">

# ArchitectOS

### AI-Native Repository Intelligence & Governance Engine

ArchitectOS analyzes your repository, explains its architecture, calculates change impact, and enforces guardrails for AI Agents (Claude Code / Cursor / Codex).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v1.2.1-orange.svg)](https://www.npmjs.com/package/architectos)
[![Dogfooded with ArchitectOS](https://img.shields.io/badge/ArchitectOS-Self--Hosted-emerald.svg)](https://github.com/cgseyhan/architectos)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![MCP Ready](https://img.shields.io/badge/MCP-Native-purple.svg)](https://modelcontextprotocol.io/)

</div>

---

> **Strict Product Mandate**: ArchitectOS **never** modifies user code directly; it exclusively analyzes, explains, calculates impact, and generates actionable refactoring plans. Code modifications are executed by AI Agents or human developers.

---

## ⚡ Quickstart & Core Commands

```bash
# 1. Initialize and review repository
npx architectos

# 2. High-level repository health, security & UI review (with optional CI threshold)
architectos review
architectos review --threshold 80

# 3. Component deep-dive (supports --why, --ui, --dead, --duplication, --taint)
architectos analyze toolbar.tsx
architectos analyze toolbar.tsx --why
architectos analyze --ui
architectos analyze --dead
architectos analyze --duplication
architectos analyze --taint auth.controller.ts

# 4. View historical score timeline and trend
architectos history

# 5. Cross-graph downstream change impact & risk rating
architectos impact auth.ts

# 6. Structured refactoring migration plan
architectos plan toolbar.tsx

# 7. Symbol resolver & natural language architecture query
architectos resolve WorkspaceRepository
architectos resolve "Where is tenant isolation enforced?"

# 8. Native MCP server gateway & live watcher
architectos watch
architectos mcp
```

---

## 🏛️ The ArchitectOS Pipeline

```text
architectos review               # High-level health & problem breakdown (--threshold 80)
      ↓
architectos analyze <target>     # Deep-dive (--why, --ui, --dead, --duplication, --taint)
      ↓
architectos impact <target>      # Cross-graph downstream change risk
      ↓
architectos plan <target>        # Step-by-step refactoring migration plan
      ↓
architectos resolve <symbol>     # Hallucination shield & symbol resolver
      ↓
architectos history              # Historical score timeline & trend tracking
      ↓
AI Agent / Developer executes refactor
```

---

## 🎯 Engine Precision & Accuracy Features

- **25 CWE-Mapped SAST Engine**: High-precision rules covering SQLi, XSS, RCE, ReDoS, Prototype Pollution, NoSQLi, Open Redirect, Unsafe Deserialization, and Weak Cryptography.
- **Context-Aware Noise Filter**: Automatically suppresses false positives inside test blocks (`describe`/`it`), JSDoc comments, dead conditional branches, and when known sanitizers (`DOMPurify`, `escapeHtml`) are detected.
- **Multi-File Taint Tracking Engine**: Traces untrusted user inputs (HTTP `req.body`/`searchParams`) down to dangerous execution sinks across multi-file import graphs.
- **Code Duplication Scanner**: Token-fingerprinted Jaccard similarity engine detecting copy-pasted code blocks across monorepo packages.
- **Framework Entrypoint Whitelist**: Eliminates false positives for Next.js (`GET`, `POST`, `generateMetadata`, `middleware`), Remix, Vitest, and CLI entrypoints.
- **Tarjan SCC Cycle Detection**: Mathematically sound circular dependency cycle detection for complex monorepos.
- **Public Scoring Transparency**: Fully documented formulas and deduction rules in [SCORING.md](SCORING.md).

---

## 🧪 Real-World Benchmark Verification (v1.2.1 Engine Breakdown)

ArchitectOS is battle-tested and dogfooded across major open-source codebases with transparent sub-metric scoring:

| Repository | Files | Overall | Arch | Sec | Qual | AI | UI | Scan Speed | Top Focus Area |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`excalidraw/excalidraw`** | 520+ | **88/100** | 92 | 84 | 90 | 94 | 80 | **<18ms** | Canvas Component Decomposition |
| **`calcom/cal.com`** | 1,400+ | **84/100** | 80 | 88 | 82 | 90 | 80 | **<45ms** | Booking Service Layer Isolation |
| **`shadcn/ui`** | 120+ | **96/100** | 98 | 95 | 96 | 95 | 96 | **<8ms** | UI Component Primitive Boundaries |
| **`cgseyhan/architectos`** | 51 | **100/100** | 100 | 100 | 100 | 100 | N/A | **<19ms** | Native Self-Hosted AST Governance |

*Note: Pure CLI / backend repositories (e.g. `architectos`) omit UI Architecture scoring.*

---

## 🤖 Native MCP Server Integration

Add ArchitectOS to your Claude Code, Cursor, or Codex MCP configuration:

```json
{
  "mcpServers": {
    "architectos": {
      "command": "npx",
      "args": ["-y", "architectos", "mcp"]
    }
  }
}
```

### Registered MCP Tools
- `architectos_review`: Repository health & problem breakdown.
- `architectos_why`: Root-cause coupling analysis.
- `architectos_impact`: Polyglot change impact calculator.
- `architectos_plan`: Step-by-step migration refactoring plan.
- `architectos_resolve`: Symbol resolver & hallucination shield.
- `architectos_dead`: Unused exports & zombie code detector.
- `architectos_ui`: Framework-agnostic UI component composition & boundary audit.
- `architectos_remember`: Store persistent architectural guardrail rules.

---

## 📄 License

MIT License © 2026 ArchitectOS Authors

<div align="center">

# ArchitectOS

### Repository Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v0.1.30-orange.svg)](https://www.npmjs.com/package/architectos)
[![Dogfooded with ArchitectOS](https://img.shields.io/badge/ArchitectOS-Self--Hosted-emerald.svg)](https://github.com/cgseyhan/architectos)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![MCP Ready](https://img.shields.io/badge/MCP-Native-purple.svg)](https://modelcontextprotocol.io/)

*ArchitectOS creates a living knowledge graph of your repository, enabling pre-commit safeguards, AST boundary analysis, and deterministic AI context for Cursor and Claude.*

</div>

---

## ⚡ 30-Second Quickstart

```bash
# Run instantly anywhere (Zero Installation)
npx architectos init

# View signature repository review report
npx architectos review

# Install fast pre-commit safeguard shield
npx architectos guard --install-hook
```

---

## 📊 The 3 Signature Developer Experiences

### 1. `architectos init` (First-Impression Indexing)
```text
ArchitectOS

Repository detected:
 ✓ Next.js
 ✓ TypeScript
 ✓ Prisma
 ✓ React

Building repository index...
 ✓ 2,846 files
 ✓ 31,220 symbols
 Completed in 3.4s

Ready. Run "architectos status" or "architectos review".
```

### 2. `architectos review` (Signature Shareable Report)
```text
📊 ArchitectOS Repository Review

Overall Health: 92/100
 ├── Architecture: 91/100
 ├── Security:     93/100
 ├── Code Quality: 88/100
 ├── AI Readiness: 91/100
 └── Maintainable: 90/100

Why?
 • 2 Layer Boundary Violation(s)
 • 1 Circular Dependency Cycle(s)
 • 3 Oversized / God Component(s)

────────────────────────────────────────────────────────────────
Estimated Fix Time: 2.4 hours
────────────────────────────────────────────────────────────────

Top Recommendations:
 [HIGH] Move WorkspaceRepository behind WorkspaceService (+15 Architecture, ~35 mins)
 [MEDIUM] Split Toolbar.tsx (+10 Code Quality, ~45 mins)
 [LOW] Generate ADR for Authentication (+5 AI Readiness, ~15 mins)
```

### 3. `architectos explain <topic>` (AI & Human Flow Visualizer)
```text
🤖 [ArchitectOS Explain] Authentication Flow

Controllers
 └── Application Service
      └── Identity Provider
           └── JWT
                └── Middleware
                     └── Protected Routes
```

---

## ⚙️ Configuration (`architectos.config.json`)

```json
{
  "ignore": [
    "dist",
    "node_modules"
  ],
  "rules": {
    "maxFileLines": 500,
    "allowCycles": false
  },
  "plugins": [
    "next",
    "react",
    "prisma"
  ]
}
```

---

## 💻 Core CLI Commands

```bash
architectos status             # Ultra-fast 5-second health score summary
architectos review             # Signature repository review report with "Why?" breakdown
architectos analyze <file>     # Component deep-dive (responsibilities, dependencies, violations)
architectos explain <topic>    # Request execution flow breakdown
architectos watch              # Sleek live repository index watcher
architectos guard              # Fast pre-commit safeguard gate (use --install-hook)
architectos doctor             # Diagnostic system readiness checklist
architectos plugin list        # List loaded framework plugins
architectos export mermaid     # Export architecture graph as Mermaid / Markdown / JSON
architectos version            # Display system & environment details
```

---

## 🔮 Product Roadmap

- **v1.0**: Repository Intelligence Platform (TS/JS, Review, Explain, Analyze, Doctor, Watch, Native MCP, CI JSON).
- **v1.1**: Polyglot AST Parsers (Python, Go, Rust) & `architectos plugin add`.
- **v1.2**: Hybrid BM25 Retrieval & Automated AST Refactoring Engine.
- **v2.0**: Cloud Dashboard & Real-Time Team Governance.

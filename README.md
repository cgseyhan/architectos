<div align="center">

# ArchitectOS

ArchitectOS analyzes your repository, explains its architecture, and helps AI agents understand it correctly.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v0.1.33-orange.svg)](https://www.npmjs.com/package/architectos)
[![Dogfooded with ArchitectOS](https://img.shields.io/badge/ArchitectOS-Self--Hosted-emerald.svg)](https://github.com/cgseyhan/architectos)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![MCP Ready](https://img.shields.io/badge/MCP-Native-purple.svg)](https://modelcontextprotocol.io/)

</div>

---

ArchitectOS analyzes your repository, explains its architecture, and helps AI agents understand it correctly.

> **Mandate**: ArchitectOS never modifies user code directly; it exclusively analyzes, explains, calculates impact, and generates actionable refactoring plans. Code modifications are executed by AI Agents (Claude Code / Cursor / Codex) or human developers.

---

## 🔄 The ArchitectOS Pipeline

```text
architectos review               # High-level repository health & top issues
      ↓
architectos why <target>         # Root-cause analysis (Why is this coupled?)
      ↓
architectos analyze <target>     # Technical metrics & coupling
      ↓
architectos impact <target>      # Cross-graph downstream risk (Files/symbols)
      ↓
architectos plan <target>        # Structured refactoring plan
      ↓
architectos explain <topic>      # Request execution flow visualizer
      ↓
AI Agent / Developer executes refactor
```

---

## ⚡ Quickstart & Primary Commands

```bash
# Initialize repository index
npx architectos init

# Refresh / re-index repository graph on demand
architectos update

# High-level repository review
architectos review

# Why is this component coupled?
architectos why toolbar.tsx

# Cross-graph downstream change impact
architectos impact auth.ts

# Structured refactoring plan
architectos plan toolbar.tsx

# Resolve symbol & prevent AI hallucinations
architectos resolve WorkspaceRepository

# Detect unused exports & zombie code
architectos dead

# Ask natural language architecture query
architectos ask "Where is tenant isolation enforced?"

# Native MCP server for Cursor, Claude Code, and Codex
architectos mcp
```

---

## 📊 Primary Features

### 1. `architectos review` (Shareable Health & Problem Breakdown)
```text
📊 ArchitectOS Repository Review

Overall Health: 92/100
 ├── Architecture: 91/100
 ├── Security:     93/100
 └── AI Readiness: 95/100

Top Problems:

 1. WorkspaceService bypasses Application Layer
    Estimated Fix: 20 min
    Why it matters: Violates domain boundary constraints
    Suggested fix: Route requests through ApplicationFacade

 2. Toolbar.tsx is an Oversized / God Component
    Estimated Fix: 45 min
    Why it matters: 350+ lines, multi-responsibility coupling
    Suggested fix: Split into ToolbarUI and ToolbarActions
```

---

### 2. `architectos analyze <file>` (Component Deep-Dive)
```text
🔍 ArchitectOS Analyze: toolbar.tsx

Responsibilities:
 - Toolbar rendering
 - Command registration
 - Keyboard shortcuts

Dependencies:
 22 imports

Problems:
 - God Component
 - Too many responsibilities

Suggestions:
 Split into:
  - ToolbarUI
  - ToolbarCommands
  - ToolbarShortcuts

Estimated effort: 45 min
```

---

### 3. `architectos explain <topic>` (Architecture & Flow Visualizer)
```text
🤖 ArchitectOS Explain: authentication

Authentication Flow:

 Login Page
     ↓
 AuthController
     ↓
 AuthService
     ↓
 Identity Provider
     ↓
 JWT
     ↓
 Middleware
     ↓
 Protected Routes
```

---

### 4. `architectos status` (5-Second Health Check)
```text
📊 ArchitectOS Status

Repository:   ArchitectOS
Health:       92/100
 ├── Architecture: 91/100
 ├── Security:     93/100
 └── AI Readiness: 90/100

AI Readiness Breakdown:
 ✓ Public APIs discoverable
 ✓ Good symbol coverage
 ✗ Missing ADRs
 ✗ Missing architectural rules

Last indexed: 2m ago
```

---

### 5. `architectos remember "<rule>"` (Persistent AI Memory & Guardrails)
```text
🧠 ArchitectOS Repository Memory Engine

✓ Saved persistent architectural rule:
  "Client UI components cannot import Prisma directly"

Rule active for Cursor, Claude Code, and Codex via MCP.
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

## 💻 Essential CLI Commands

```bash
architectos init               # Fast repository setup and index initialization
architectos status             # 5-second health score & AI readiness summary
architectos review             # Signature repository review report with top problems & fix time
architectos explain <topic>    # Architecture execution flow visualizer
architectos analyze <file>     # Component responsibility, dependency & problem breakdown
architectos remember "<rule>"  # Store persistent architectural rule for Cursor/Claude via MCP
architectos watch              # Sleek sub-150ms live index watcher
architectos mcp                # Native MCP server gateway for Cursor, Claude Code, and Codex
```

---

## 🔮 Roadmap

- **v1.0**: Focus on 3 core pillars: Repository Review, Architecture Explain, and AI Context.
- **v1.1**: Polyglot AST Parsers (Python, Go, Rust) & Plugin Loader.
- **v1.2**: Hybrid BM25 Retrieval & Automated AST Refactoring Engine.
- **v2.0**: Cloud Dashboard & Team Governance.

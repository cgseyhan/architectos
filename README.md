<div align="center">

# ArchitectOS

ArchitectOS analyzes your repository, explains its architecture, and helps AI agents understand it correctly.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v0.1.31-orange.svg)](https://www.npmjs.com/package/architectos)
[![Dogfooded with ArchitectOS](https://img.shields.io/badge/ArchitectOS-Self--Hosted-emerald.svg)](https://github.com/cgseyhan/architectos)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![MCP Ready](https://img.shields.io/badge/MCP-Native-purple.svg)](https://modelcontextprotocol.io/)

</div>

---

ArchitectOS analyzes your repository and helps both developers and AI agents understand it.

In less than a minute it can:
• Explain your architecture  
• Detect architectural problems  
• Review repository health  
• Generate AI-ready context  
• Connect to Cursor, Claude Code, and Codex through MCP  

---

## ⚡ 30-Second Quickstart

```bash
# Initialize repository index
npx architectos init

# Check 5-second quick health status
npx architectos status

# Generate signature repository review
npx architectos review

# Explain request execution flow
npx architectos explain auth

# Deep-dive component responsibilities and problems
npx architectos analyze toolbar.tsx
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
architectos watch              # Sleek sub-150ms live index watcher
architectos mcp                # Native MCP server gateway for Cursor, Claude Code, and Codex
```

---

## 🔮 Roadmap

- **v1.0**: Focus on 3 core pillars: Repository Review, Architecture Explain, and AI Context.
- **v1.1**: Polyglot AST Parsers (Python, Go, Rust) & Plugin Loader.
- **v1.2**: Hybrid BM25 Retrieval & Automated AST Refactoring Engine.
- **v2.0**: Cloud Dashboard & Team Governance.

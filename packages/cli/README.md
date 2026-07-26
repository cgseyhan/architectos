<div align="center">

# ArchitectOS

### ESLint for Architecture. MCP for AI. Digital Twin for Repositories.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v0.1.12-orange.svg)](https://www.npmjs.com/package/architectos)
[![Dogfooded with ArchitectOS](https://img.shields.io/badge/ArchitectOS-Self--Hosted-emerald.svg)](https://github.com/cgseyhan/architectos)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![MCP Ready](https://img.shields.io/badge/MCP-Native-purple.svg)](https://modelcontextprotocol.io/)

*ArchitectOS creates a living digital twin of your repository, enabling deterministic AI context, architecture governance, and repository intelligence from a single CLI.*

</div>

---

## ⚡ 30-Second Quickstart

```bash
# Run instantly anywhere (Zero Installation)
npx architectos init

# View living repository health & AI readiness dashboard
npx architectos status
```

```
📊 ArchitectOS Repository Report

Project & Environment
────────────────────────────────────────────────────────────────
Name              Preceda
Language          TypeScript / JavaScript
Files             4,821
Services          37
Modules           91

Architecture & Governance
────────────────────────────────────────────────────────────────
Health Score      96/100 ✅ [Healthy]
Cycles            0 ✓
Layer Violations  0 ✓
Technical Debt    98/100

AI Readiness & MCP
────────────────────────────────────────────────────────────────
AI Context Score  97/100 ✓ [Ready]
Memory Rules      Active
MCP Gateway       Enabled (npx architectos mcp)

Status & Insights
────────────────────────────────────────────────────────────────
✓ Repository domain boundaries healthy & ready for AI agents.
```

---

## 📥 Installation

```bash
# Global CLI Installation
npm i -g architectos

# Or install as project developer dependency
npm i -D architectos
```

---

## 🤖 Unified AI Agent MCP Gateway

ArchitectOS acts as the shared **architectural brain** for all AI coding agents:

```
Claude Code ──┐
Cursor       ──┼──► ArchitectOS MCP ──► Living Repository Digital Twin
Gemini CLI   ──┤
OpenAI       ──┘
```

Add ArchitectOS to your `claude_desktop_config.json` or Cursor MCP settings:

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

---

## 🛡️ Senior Architect Governance & Auto-Fix Engine

ArchitectOS acts as your **Senior Principal Architect Mentor**.

When you run `architectos review` or `architectos check`, ArchitectOS provides a 4-part architectural analysis:

```
$ architectos review

🛡️ [ArchitectOS Governance] Reviewing Architecture & Enforcing Constitutional Rules...

================================================================================
📊 ARCHITECTURAL CONSTITUTION REVIEW MATRIX
================================================================================
Overall Health Score: 38/100
Architecture Score: 0/100 | Security Score: 40/100 | Maintainability: 99/100
================================================================================

❌ [FAIL] 1 Constitutional Violation(s) Detected:

# Constitutional Violation Report #1
Rule:        ui-infrastructure-boundary
Severity:    🔴 High | Confidence: 100%

Files Affected:
  • apps/landing/app/dashboard/page.tsx
  • apps/landing/app/dashboard/repository/document-repository.ts

## 1. Why this violates the architecture
Presentation Layer (UI) is directly accessing Infrastructure Layer (Database).

## 2. Expected Architecture
Expected Flow:  UI Component  ──►  Application Service  ──►  Infrastructure
Current Flow:   UI Component  ───────(BYPASSED)───────►  Infrastructure  ❌

## 4. Auto Fix & Architecture Impact
Architecture Health Impact:
  Before Fix:  38 / 100
  After Fix:   98 / 100  (▲ +60 pts)

Run: architectos fix ui-infrastructure-boundary
```

### Automated Refactoring (`architectos fix`)

Run automated architecture boundary refactoring:
```bash
architectos fix ui-infrastructure-boundary
```

---

## ⚡ Without ArchitectOS vs. With ArchitectOS

| Without ArchitectOS | With ArchitectOS |
| :--- | :--- |
| AI coding tools only see flat, disconnected files | AI understands full system architecture & domain boundaries |
| Manual dependency & cycle tracking | Automatic multi-dimensional repository graph |
| Static, outdated documentation | Living, self-updating digital twin |
| Naive text vector search & hallucinations | Token-budgeted deterministic AI context retrieval |
| Architecture drift & broken boundaries | Continuous CI governance & constitutional rule enforcement |

---

## 💻 CLI Commands (Grouped into 4 Categories)

### 1. Setup & Diagnostics
```bash
architectos init               # Zero-config stack auto-detect & full repository indexing
architectos status             # View WOW repository digital twin health & metrics summary
architectos doctor             # Run system diagnostic check (Graph, Plugins, MCP status)
architectos index              # Re-index codebase & update digital twin graph cache
```

### 2. Explore & Intelligence
```bash
architectos search auth        # Multi-dimensional search across Files, Services, Endpoints, Owners
architectos trace POST /login  # Trace request execution flow across architectural layers
architectos locate Controller  # Locate component boundaries matching query
architectos timeline           # View historical repository evolution & health trends
architectos insights           # View coupling density, largest modules, and drift risk
```

### 3. AI Engine & Context
```bash
architectos explain auth       # Retrieve token-budgeted AI architecture explanation
architectos eval "oauth flow"  # Measure AI context completeness & hallucination risk
architectos remember "<rule>"  # Record persistent architectural memory for AI agents
architectos plan "Hexagonal"   # Generate step-by-step AI refactoring roadmap
architectos mcp                # Start JSON-RPC MCP server for Claude, Cursor, Gemini
```

### 4. Governance & Architecture Guard
```bash
architectos review             # Run System Health review with Actionable Recommended Tasks Checklist
architectos fix-plan           # Generate LLM implementation prompt roadmaps for Cursor / Claude / Codex
architectos fix <rule>         # Run automated architectural refactoring engine
architectos check              # Run architecture constitution & CI policy gate
architectos diff               # Calculate architecture graph diff between branches
architectos adr generate       # Automatically generate Architecture Decision Record (ADR)
```

---

## 🐕 Self-Hosted Architecture

> **"ArchitectOS is built, governed, and quality-assured by ArchitectOS."**

We use ArchitectOS to analyze, govern, and maintain the software architecture of ArchitectOS itself:

```
$ architectos status

Repository       architectos
Health           91/100
Architecture     Healthy
Cycles           0
Violations       0
Services         3 (@architectos/core, cli, mcp)
Endpoints        12
Database Tables  6
AI Readiness     100/100
```

---

## 📄 License

Distributed under the [MIT License](LICENSE).

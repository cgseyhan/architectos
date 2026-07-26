<div align="center">

# ArchitectOS

### ESLint for Architecture. MCP for AI. ArchitectOS for Repositories.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v0.1.28-orange.svg)](https://www.npmjs.com/package/architectos)
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
📊 ArchitectOS Repository Status

Project & Environment
────────────────────────────────────────────────────────────────
Name              Preceda
Language          TypeScript / JavaScript
Files             4,821
Services          37
Modules           91

🔍 Analysis System: Quality Model & Score Reasons
────────────────────────────────────────────────────────────────
Overall Score     92/100 ✅ [Healthy]
 ├── Architecture 96/100 -> Reason: Clean domain boundaries & DAG graph integrity
 ├── Security     94/100 -> Reason: Zero SAST vulnerabilities & secrets detected
 ├── Code Quality 90/100 -> Reason: Evaluated across AST complexity & file sizes
 ├── AI Readiness 97/100 -> Reason: 100% Symbol coverage & active memory rules
 ├── Testability  88/100 -> Reason: Evaluated against valid assertion test files
 └── Maintainable 89/100 -> Reason: Low technical debt

Repository Insights
 ├── Largest Module        AuthenticationService.ts (480 lines)
 ├── Most Connected        WorkspaceService.ts (24 dependencies)
 ├── Circular Dependencies 0
 └── Dead Code             3 file(s)

🤖 AI System: Refactor Safety & AI Readiness
────────────────────────────────────────────────────────────────
Refactor Safety   92% (Safe for AI-assisted refactoring)
AI Context        Token-Budgeted Deterministic AST Map
Repository Memory Active (Rules Enabled)

🛡️ Governance System: Estimated Debt & Top Recommendations
────────────────────────────────────────────────────────────────
Estimated Technical Debt: 45 mins
Based on:
  • 3 Dead Code File(s) (10 mins each)

Top Recommendations
────────────────────────────────────────────────────────────────
  ✓ Repository domain boundaries healthy & ready for AI agents.
```

---

## 🌟 Real-World Open-Source Benchmarks

ArchitectOS analyzes real-world open-source repositories out of the box with zero configuration:

<details>
<summary><b>🐻 Zustand (pmndrs/zustand) — Overall Score: 87/100</b></summary>

```
📊 ArchitectOS Repository Status

Project & Environment: pmndrs/zustand (55 files)

🔍 Analysis System: Quality Model & Score Reasons
────────────────────────────────────────────────────────────────
Overall Score     87/100 ✅ [Healthy]
 ├── Architecture 80/100 -> Reason: Clean domain boundaries & DAG graph integrity
 ├── Security     100/100 -> Reason: Zero SAST vulnerabilities & secrets detected
 ├── Code Quality 93/100 -> Reason: Evaluated across AST complexity & file sizes
 ├── AI Readiness 64/100 -> Reason: Missing persistent memory rules or ADRs
 ├── Testability  100/100 -> Reason: Evaluated against valid assertion test files
 └── Maintainable 90/100 -> Reason: 14 Dead Code file(s) detected

Repository Insights
 ├── Largest Module        devtools.test.tsx (2,596 lines)
 ├── Most Connected        vanilla.ts (7 dependencies)
 ├── Circular Dependencies 0
 └── Dead Code             14 file(s)

🤖 AI System: Refactor Safety
────────────────────────────────────────────────────────────────
Refactor Safety   100% (Safe for AI-assisted refactoring)
```

</details>

<details>
<summary><b>🚀 Express.js (expressjs/express) — Overall Score: 87/100</b></summary>

```
📊 ArchitectOS Repository Status

Project & Environment: expressjs/express (142 files)

🔍 Analysis System: Quality Model & Score Reasons
────────────────────────────────────────────────────────────────
Overall Score     87/100 ✅ [Healthy]
 ├── Architecture 80/100 -> Reason: Clean domain boundaries & DAG graph integrity
 ├── Security     100/100 -> Reason: Zero SAST vulnerabilities & secrets detected
 ├── Code Quality 93/100 -> Reason: Evaluated across AST complexity & file sizes
 ├── AI Readiness 68/100 -> Reason: Missing persistent memory rules or ADRs
 ├── Testability  100/100 -> Reason: Evaluated against valid assertion test files
 └── Maintainable 85/100 -> Reason: 72 Dead Code file(s) detected

Repository Insights
 ├── Largest Module        app.router.js (1,218 lines)
 ├── Most Connected        utils.js (10 dependencies)
 ├── Circular Dependencies 0
 └── Dead Code             72 file(s)

🤖 AI System: Refactor Safety
────────────────────────────────────────────────────────────────
Refactor Safety   100% (Safe for AI-assisted refactoring)
```

</details>

<details>
<summary><b>🎯 Zod (colinhacks/zod) — Overall Score: 86/100</b></summary>

```
📊 ArchitectOS Repository Status

Project & Environment: colinhacks/zod (430 files)

🔍 Analysis System: Quality Model & Score Reasons
────────────────────────────────────────────────────────────────
Overall Score     86/100 ✅ [Healthy]
 ├── Architecture 80/100 -> Reason: Clean domain boundaries & DAG graph integrity
 ├── Security     95/100 -> Reason: 1 Supply Chain Risk(s)
 ├── Code Quality 94/100 -> Reason: Evaluated across AST complexity & file sizes
 ├── AI Readiness 67/100 -> Reason: Missing persistent memory rules or ADRs
 ├── Testability  100/100 -> Reason: Evaluated against valid assertion test files
 └── Maintainable 86/100 -> Reason: 199 Dead Code file(s) detected

Repository Insights
 ├── Largest Module        types.ts (5,139 lines)
 ├── Most Connected        language-server.source.ts (1 dependency)
 ├── Circular Dependencies 0
 └── Dead Code             199 file(s)

🤖 AI System: Refactor Safety
────────────────────────────────────────────────────────────────
Refactor Safety   100% (Safe for AI-assisted refactoring)
```

</details>

<details>
<summary><b>⚡ Fastify (fastify/fastify) — Overall Score: 79/100</b></summary>

```
📊 ArchitectOS Repository Status

Project & Environment: fastify/fastify (293 files)

🔍 Analysis System: Quality Model & Score Reasons
────────────────────────────────────────────────────────────────
Overall Score     79/100 ⚠️ [Action Required]
 ├── Architecture 50/100 -> Reason: 6 God Component(s)
 ├── Security     100/100 -> Reason: Zero SAST vulnerabilities & secrets detected
 ├── Code Quality 88/100 -> Reason: Evaluated across AST complexity & file sizes
 ├── AI Readiness 69/100 -> Reason: Missing persistent memory rules or ADRs
 ├── Testability  100/100 -> Reason: Evaluated against valid assertion test files
 └── Maintainable 88/100 -> Reason: 48 Dead Code file(s) detected

Repository Insights
 ├── Largest Module        hooks.test.js (3,673 lines)
 ├── Most Connected        fastify.js (91 dependencies)
 ├── Circular Dependencies 0
 └── Dead Code             48 file(s)

🤖 AI System: Refactor Safety
────────────────────────────────────────────────────────────────
Refactor Safety   70% (Safe for AI-assisted refactoring)
```

</details>

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

## 🛡️ Senior Architect Governance & Actionable Refactoring Engine

ArchitectOS acts as your **Senior Principal Architect Mentor**.

When you run `architectos review` or `architectos check`, ArchitectOS evaluates universal clean architecture principles and provides an **Actionable Recommended Tasks Checklist**:

```
$ architectos review

🛡️ [ArchitectOS Governance] Reviewing Architecture & Enforcing Constitutional Rules...

🔍 Analysis System: Quality Model & Score Reasons
────────────────────────────────────────────────────────────────
Overall Score     38/100 ⚠️ [Action Required]
 ├── Architecture 0/100  -> Reason: 4 Layer Violations, 3 Cycles
 ├── Security     40/100 -> Reason: 1 Hardcoded Secret, 2 SAST Flaws
 ├── Code Quality 80/100 -> Reason: 4 Large Files >300 lines
 ├── AI Readiness 41/100 -> Reason: Missing persistent memory rules & ADRs
 ├── Testability  50/100 -> Reason: Missing unit test assertions
 └── Maintainable 60/100 -> Reason: 12 Dead Code file(s) detected

🤖 AI System: Refactor Safety & AI Readiness
────────────────────────────────────────────────────────────────
Refactor Safety   45% (Requires manual developer review before AI refactoring)

🛡️ Governance System: Estimated Debt & Top Recommendations
────────────────────────────────────────────────────────────────
Estimated Technical Debt: 5.8 hrs
Based on:
  • 4 Layer Boundary Violation(s) (45 mins each)
  • 3 Circular Dependency Cycle(s) (30 mins each)
  • 2 Critical SAST Vulnerabilities (30 mins each)
  • 4 Large File(s) >300 lines (20 mins each)

Top Recommendations
────────────────────────────────────────────────────────────────
  [HIGH] Resolve 4 Layer Boundary Violation(s) (+15 Architecture, ~35 mins) -> architectos review
  [HIGH] Break 3 Circular Import Cycle(s) (+10 Architecture, ~20 mins) -> architectos fix-plan
  [MEDIUM] Generate ADRs & Repository Memory Rules (+15 AI Readiness, ~15 mins) -> architectos remember

Run 'architectos fix-plan' to generate LLM prompt roadmaps for Cursor / Claude / Codex!
```

### 🤖 LLM Prompt Implementation Roadmap (`architectos fix-plan`)

Turn actionable recommendations into step-by-step LLM implementation prompts formatted for **Cursor, Claude Code, and Codex**:

```bash
$ architectos fix-plan

⚡ [ArchitectOS AI Refactoring Plan] Generating LLM Implementation Roadmaps...

✓ Generated AI Refactoring Implementation Roadmap
  File Saved: .architectos/reports/FIX-PLAN.md

================================================================================
🤖 LLM PROMPT ROADMAP FOR AI AGENTS (Cursor / Claude Code / Codex)
================================================================================

Prompt #1 [Refactor Presentation Layer]:
  "Create an Application Service abstraction layer and update Presentation Layer imports."

Prompt #2 [Decouple Circular Imports]:
  "Extract shared domain interfaces/types into a dedicated domain/types module."
```

### ⚡ Automated Refactoring (`architectos fix`)

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

## 🏛️ Self-Hosted Architecture

> **"ArchitectOS is built, governed, and quality-assured by ArchitectOS."**

We use ArchitectOS to analyze, govern, and maintain the software architecture of ArchitectOS itself:

```
$ architectos status

📊 ArchitectOS Repository Status

🔍 Analysis System: Quality Model & Score Reasons
────────────────────────────────────────────────────────────────
Overall Score     91/100 ✅ [Healthy]
 ├── Architecture 98/100 -> Reason: Clean domain boundaries & DAG graph integrity
 ├── Security     85/100 -> Reason: 1 SAST Flaw(s)
 ├── Code Quality 97/100 -> Reason: Evaluated across AST complexity & file sizes
 ├── AI Readiness 100/100 -> Reason: 100% Symbol coverage & active memory rules
 ├── Testability  93/100 -> Reason: Evaluated against valid assertion test files
 └── Maintainable 96/100 -> Reason: Low technical debt

🤖 AI System: Refactor Safety & AI Readiness
────────────────────────────────────────────────────────────────
Refactor Safety   90% (Safe for AI-assisted refactoring)
```

---

## 📄 License

Distributed under the [MIT License](LICENSE).

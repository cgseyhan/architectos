<div align="center">

# ArchitectOS

### ArchitectOS is to software architecture what Git is to source code.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v0.1.9-orange.svg)](https://www.npmjs.com/package/architectos)
[![Dogfooded with ArchitectOS](https://img.shields.io/badge/ArchitectOS-Self--Hosted-emerald.svg)](https://github.com/cgseyhan/architectos)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![MCP Ready](https://img.shields.io/badge/MCP-Native-purple.svg)](https://modelcontextprotocol.io/)

*ArchitectOS creates a living digital twin of your repository, enabling deterministic AI context, architecture governance, and repository intelligence from a single CLI.*

</div>

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

## 📥 Installation

Install globally or as a project dependency:

```bash
# Global CLI Installation
npm i -g architectos

# Or install in your project
npm i -D architectos

# Or run instantly via npx (Zero Installation)
npx architectos init
```

---

## 🌟 Category Definition

| Tool | Domain / Category |
| :--- | :--- |
| **Git** | Source Control Management |
| **Docker** | Containerization Platform |
| **Terraform** | Infrastructure-as-Code |
| **Prisma** | Database ORM |
| **ArchitectOS** | **Repository Intelligence & Architecture Operating System** |

---

## 🎯 Common Use-Cases

* **✓ Understand a 2M LOC monorepo in minutes**
* **✓ Prepare perfect, token-budgeted AI context for Claude Code & Cursor**
* **✓ Detect architectural violations and circular imports before merge**
* **✓ Trace request execution flows across microservices and controllers**
* **✓ Measure engineering health and AI readiness continuously**
* **✓ Build a searchable multi-dimensional repository knowledge graph**
* **✓ Power your own autonomous AI coding agents via MCP**

---

## 🛡️ Senior Architect Governance & Auto-Fix Engine

ArchitectOS is not just a linter—it acts as your **Senior Principal Architect Mentor**.

When you run `architectos review` or `architectos check`, ArchitectOS provides a 4-part architectural analysis:

```
🛡️ [ArchitectOS Governance] Reviewing Architecture & Enforcing Constitutional Rules...

================================================================================
📊 ARCHITECTURAL CONSTITUTION REVIEW MATRIX
================================================================================
Overall Health Score: 38/100
Architecture Score: 0/100 | Security Score: 40/100 | Maintainability: 99/100
================================================================================

❌ [FAIL] 1 Constitutional Violation(s) Detected:

--------------------------------------------------------------------------------
# Constitutional Violation Report #1
--------------------------------------------------------------------------------
Rule:        ui-infrastructure-boundary
Severity:    🔴 High | Confidence: 100%

Files Affected:
  • apps/landing/app/dashboard/page.tsx
  • apps/landing/app/dashboard/repository/document-repository.ts

## 1. Why this violates the architecture
Presentation Layer (UI) is directly accessing Infrastructure Layer (Database).
This bypasses the Application Layer and couples UI components directly to persistence.

Reason:
  Application Services are the only orchestration layer in a domain-driven system.

Benefits of Compliance:
  • Easier Unit Testing (mocking services instead of direct DB)
  • Framework & Infrastructure Independence
  • Reusable Business Logic across Web/Mobile/API
  • Zero Data Leakage to Presentation Layer

## 2. Expected Architecture
Expected Flow:
  UI Component  ──►  Application Service  ──►  Infrastructure / Repository

Current Flow:
  UI Component  ───────(BYPASSED SERVICE)───────►  Infrastructure / Repository  ❌

## 3. Recommended Refactoring
Instead of:  page.tsx  ──►  document-repository.ts
Introduce:   page.tsx  ──►  WorkspaceService  ──►  document-repository.ts

Suggested Responsibilities:
  • hydrateWorkspace()
  • fetchWorkspaceDigest()

Estimated Effort: ~15 minutes

## 4. Auto Fix & Architecture Impact
Architecture Health Impact:
  Before Fix:  38 / 100
  After Fix:   98 / 100  (▲ +60 pts)

Technical Debt Reduced:
  -1 Constitutional Violation

Auto Fix Command:
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

## 🚀 30-Second Quickstart

```bash
architectos init
architectos status
architectos search auth
```

### What Happens During `architectos init`?

```
$ architectos init

Detecting repository...
✓ Next.js
✓ React
✓ TypeScript
✓ Prisma
✓ pnpm workspace

Loading plugins...
✓ @architectos/plugin-next
✓ @architectos/plugin-react
✓ @architectos/plugin-prisma

Building Digital Twin...
✓ AST parsed
✓ Knowledge graph built
✓ Architecture graph indexed
✓ AI context generated

Done. Run: architectos status
```

### Digital Twin Status Summary (`architectos status`)

```
$ architectos status

Repository       Preceda
Health           98/100
Architecture     Healthy
Cycles           0
Violations       0
Services         74
Endpoints        261
Database Tables  81
AI Readiness     99/100
```

---

## 📁 What `architectos init` Generates

ArchitectOS builds a local, self-contained digital twin repository directory:

```
.architectos/
    graph.db         # Semantic & Knowledge Graph
    health.json      # Engineering Health Matrix
    context/         # AI Context Index
    cache/           # AST Analysis Cache
    memory/          # Persistent Repository Memory Store
    plugins.json     # Stack Auto-Discovery Config
    reports/         # Generated ADRs, Audits, Diffs, & Health History
```

---

## 🌐 Living Digital Twin Construction Pipeline

```
Source Code ──► AST ──► Knowledge Graph ──► Architecture Graph ──► Runtime Metadata ──► Repository Memory ──► AI Context ──► Living Digital Twin
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

### Quick MCP Setup (Cursor / Claude Desktop / Windsurf)

Add ArchitectOS to your `claude_desktop_config.json` or Cursor MCP settings:

#### Option 1: Zero Installation (`npx`)
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

#### Option 2: Global CLI Installation (`npm i -g architectos`)
```json
{
  "mcpServers": {
    "architectos": {
      "command": "architectos",
      "args": ["mcp"]
    }
  }
}
```

---

## 💻 CLI Commands (Grouped into 4 Categories)

### 1. Setup & Diagnostics
```bash
architectos init               # Zero-config stack auto-detect & full repository indexing
architectos status             # View repository digital twin health & metrics summary
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
architectos review             # Run 4-part Senior Architect constitutional review
architectos fix <rule>         # Run automated architectural refactoring engine
architectos check              # Run architecture constitution & CI policy gate
architectos diff               # Calculate architecture graph diff between branches
architectos adr generate       # Automatically generate Architecture Decision Record (ADR)
```

---

## 🔌 Auto-Detected Plugins Marketplace

ArchitectOS automatically detects your stack and loads matching plugins:

* **✓ Next.js** (`@architectos/plugin-next`) – Next.js App Router & Server Components
* **✓ React** (`@architectos/plugin-react`) – React Component Hierarchy
* **✓ NestJS / Express** – API Controllers & Routing Graphs
* **✓ Prisma** (`@architectos/plugin-prisma`) – Prisma ORM Entities & Schema
* **✓ PostgreSQL / Supabase** – SQL Schemas & Table Relations
* **✓ Docker** (`@architectos/plugin-docker`) – Container Networks & Services
* **✓ Kubernetes** – Pod Topology & Helm Charts
* **✓ Terraform** (`@architectos/plugin-terraform`) – Infrastructure-as-Code Graph
* **✓ Temporal** (`@architectos/plugin-temporal`) – Workflow & Activity Graphs
* **✓ Kafka** (`@architectos/plugin-kafka`) – Topics & Event Stream Topology

---

## 📄 License

Distributed under the [MIT License](LICENSE).

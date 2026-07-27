# @architectos/core

> Core AST parsing, knowledge graph indexing, health scoring, SAST security scanner, taint tracking, and duplication detection engine for ArchitectOS.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v1.2.1-orange.svg)](https://www.npmjs.com/package/@architectos/core)

---

## 📦 Installation

```bash
npm install @architectos/core
```

---

## ⚡ Programmatic Usage

```javascript
const {
  GraphBuilder,
  calculateHealth,
  loadConfig,
  scanCodeForVulnerabilities,
  scanDuplication,
  analyzeTaint,
  exportGraph,
  getContextBundle
} = require('@architectos/core');

const targetDir = process.cwd();
const config = loadConfig(targetDir);

// 1. Scan repository and build AST knowledge graph
const builder = new GraphBuilder(targetDir, config);
const graphData = builder.scan();

// 2. Calculate engineering health metrics (Architecture, Security, Quality, AI Readiness)
const health = calculateHealth(graphData, targetDir);
console.log(`Overall Health Score: ${health.overallScore}/100`);

// 3. Scan code for 25 CWE security vulnerabilities with context-aware noise filtering
const vulns = scanCodeForVulnerabilities(sourceCode, 'src/controllers/auth.ts');
console.log(`Vulnerabilities found: ${vulns.length}`);

// 4. Run token-fingerprinted code duplication analysis
const dupResult = scanDuplication(graphData, targetDir);
console.log(`Duplication Ratio: ${dupResult.duplicationRatio}`);

// 5. Trace multi-file untrusted data flow (Sources -> Sinks)
const taintResult = analyzeTaint('auth.controller.ts', graphData, targetDir);
console.log(`Taint paths detected: ${taintResult.detectedPathsCount}`);

// 6. Export graph to Mermaid format
const mermaidGraph = exportGraph(graphData, 'mermaid');
console.log(mermaidGraph);
```

---

## ⚙️ Core Modules & Engines

- `GraphBuilder`: Multi-source AST dependency parser and incremental indexing engine.
- `calculateHealth`: Engineering health scoring matrix with transparent deduction reasons.
- `scanCodeForVulnerabilities`: 25 CWE-mapped SAST engine with JSDoc, test block, and sanitizer filters.
- `scanDuplication`: Token-fingerprinted Jaccard similarity engine detecting copy-pasted code blocks.
- `analyzeTaint`: Multi-file source-to-sink data flow tracer across import graphs.
- `getContextBundle`: Deterministic token-budgeted AI context retrieval engine for Cursor and Claude.
- `watchRepository`: Live file change watcher with sub-150ms incremental twin updates.
- `exportGraph`: Multi-format export engine (`mermaid`, `markdown`, `json`).

---

## 📄 License

MIT © [cgseyhan](https://github.com/cgseyhan)

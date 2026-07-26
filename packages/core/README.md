# @architectos/core

> Core AST parsing, knowledge graph indexing, health scoring, and retrieval engine for ArchitectOS.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v0.1.30-orange.svg)](https://www.npmjs.com/package/@architectos/core)

---

## 📦 Installation

```bash
npm install @architectos/core
```

---

## ⚡ Programmatic Usage

```javascript
const { GraphBuilder, calculateHealth, loadConfig, getContextBundle, exportGraph } = require('@architectos/core');

const targetDir = process.cwd();
const config = loadConfig(targetDir);

// 1. Scan repository and build AST knowledge graph
const builder = new GraphBuilder(targetDir, config);
const graphData = builder.scan();

// 2. Calculate engineering health metrics
const health = calculateHealth(graphData, targetDir);
console.log(`Overall Health Score: ${health.overallScore}/100`);

// 3. Export graph to Mermaid format
const mermaidGraph = exportGraph(graphData, 'mermaid');
console.log(mermaidGraph);

// 4. Retrieve token-budgeted AI context bundle
const bundle = getContextBundle('Authentication Flow', graphData, 4096);
console.log(`Context Token Count: ~${bundle.estimatedTokenCount}`);
```

---

## ⚙️ Modules & Exports

- `GraphBuilder`: Multi-source AST dependency parser and incremental indexing engine.
- `calculateHealth`: Engineering health scoring matrix (Architecture, Security, Quality, AI Readiness, Maintainability).
- `getContextBundle`: Deterministic token-budgeted AI context retrieval engine for Cursor and Claude.
- `watchRepository`: Live file change watcher with sub-150ms incremental twin updates.
- `exportGraph`: Multi-format export engine (`mermaid`, `markdown`, `json`).
- `loadConfig`: Configuration loader with `.architectosignore` support.

---

## 📄 License

MIT © [cgseyhan](https://github.com/cgseyhan)

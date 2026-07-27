/**
 * ArchitectOS Core Platform Engine
 * 
 * ArchitectOS is to software architecture what Git is to source code.
 * Provides AST scanning, knowledge graph indexing, engineering health metrics,
 * cross-graph impact analysis, deterministic AI context budgeting, persistent repository memory,
 * automated ADR generation, and living digital twin query capabilities.
 * 
 * @module @architectos/core
 * @license MIT
 */

const { loadConfig, initConfig, autoDetectStack, DEFAULT_CONFIG, addPlugin, removePlugin } = require('./config');
const GraphBuilder = require('./graph/builder');
const { calculateHealth } = require('./graph/health');
const { analyzeImpact } = require('./graph/impact');
const { getContextBundle } = require('./graph/retrieval');
const { explainWhy } = require('./graph/why');
const { detectZombieExports } = require('./graph/zombie');
const { resolveSymbol } = require('./graph/resolve');
const MemoryEngine = require('./memory');
const AdrEngine = require('./adr');
const { calculateDiff } = require('./diff');
const { evaluateAiContext } = require('./eval');
const { generateRefactoringPlan } = require('./plan');
const { runDoctor, searchArchitecture, traceFlow, getTimeline, simulateChange, getEnterpriseInsights } = require('./twin');
const { exportGraph } = require('./export');
const { watchRepository } = require('./watch');
const { NodeType, EdgeType, ArchitecturalStyle } = require('./types');

/**
 * Loads project configuration from architectos.config.json or returns auto-detected stack defaults.
 * @function loadConfig
 * @param {string} targetDir - The root path of the target repository.
 * @returns {Object} Complete configuration object with auto-detected plugins and architectural rules.
 */

/**
 * Initializes architectos.config.json with auto-detected framework plugins (Next.js, Prisma, React, etc.).
 * @function initConfig
 * @param {string} targetDir - The root path of the target repository.
 * @returns {{ configPath: string, config: Object, detected: Object }} Configuration initialization result.
 */

/**
 * Auto-detects framework stack and tooling (Next.js, React, TypeScript, Prisma, Docker, Terraform).
 * @function autoDetectStack
 * @param {string} targetDir - The root path of the target repository.
 * @returns {{ frameworks: string[], plugins: string[] }} Detected frameworks and matching ArchitectOS plugins.
 */

/**
 * Multi-Source Graph Builder.
 * Parses AST, extracts file & symbol nodes, builds dependency edges, detects circular import cycles,
 * and enforces architectural constitution boundaries.
 * @class GraphBuilder
 * @param {string} targetDir - The root path of the target repository.
 * @param {Object} config - Configuration object containing architectural rules.
 */

/**
 * Calculates overall engineering health score (0-100) across Architecture, Security, Maintainability,
 * Testability, AI Readiness, and Technical Debt.
 * @function calculateHealth
 * @param {Object} graphData - The scanned repository graph data with nodes, edges, cycles, and violations.
 * @returns {Object} Comprehensive health metrics matrix and overall health score.
 */

/**
 * Performs heterogeneous cross-graph impact analysis for a target component or symbol change.
 * @function analyzeImpact
 * @param {string} targetNodeId - The relative file path or component symbol ID to simulate.
 * @param {Object} graphData - The repository knowledge graph data.
 * @returns {Object} Affected components, downstream services, breaking change risks, and blast radius.
 */

/**
 * Generates token-budgeted, deterministic AI context bundles for LLM coding agents.
 * Eliminates hallucinations by providing precise AST context, domain boundaries, and ADR records.
 * @function getContextBundle
 * @param {string} query - The query topic or task description.
 * @param {Object} graphData - The repository knowledge graph data.
 * @param {number} [maxTokens=4000] - Maximum token budget limit.
 * @returns {Object} Token-budgeted context string and symbol references.
 */

/**
 * Persistent Repository Memory Engine.
 * Records architectural constraints, conventions, and rules that AI coding agents must obey across sessions.
 * @class MemoryEngine
 * @param {string} targetDir - The root path of the target repository.
 */

/**
 * Automated Architecture Decision Record (ADR) Engine.
 * Generates standardized ADR markdown documents stored in .architectos/reports/ADR-XXXX.md.
 * @class AdrEngine
 * @param {string} targetDir - The root path of the target repository.
 */

/**
 * Calculates structural diffs between two repository graph states or git branches.
 * @function calculateDiff
 * @param {Object} prevGraph - Previous repository graph snapshot.
 * @param {Object} currentGraph - Current repository graph snapshot.
 * @returns {Object} Added files, removed files, new cycles introduced, and structural health delta.
 */

/**
 * Evaluates AI Context Completeness, missing symbols, and hallucination risk for LLM prompts.
 * @function evaluateAiContext
 * @param {Object} bundle - The context bundle produced by getContextBundle.
 * @param {Object} graphData - The repository knowledge graph data.
 * @returns {Object} AI Context score (0-100), completeness %, and hallucination risk level.
 */

/**
 * Generates step-by-step AI refactoring migration plans and effort estimations.
 * @function generateRefactoringPlan
 * @param {string} topic - The refactoring topic or architectural migration goal.
 * @param {Object} graphData - The repository knowledge graph data.
 * @returns {Object} Structured migration roadmap, execution steps, and estimated hours.
 */

/**
 * Runs 6-point system diagnostic check on repository graph, plugins, cache, and MCP readiness.
 * @function runDoctor
 * @param {string} targetDir - The root path of the target repository.
 * @returns {Object} Diagnostic status checks and readiness matrix.
 */

/**
 * Multi-dimensional search across Files, Services, Endpoints, Events, DB Tables, and Owners.
 * @function searchArchitecture
 * @param {string} query - The search query term.
 * @param {Object} graphData - The repository knowledge graph data.
 * @returns {Object} Categorized search results and matching architectural subsystems.
 */

/**
 * Traces request execution flow across architectural layers (Gateway -> Controller -> Service -> DB).
 * @function traceFlow
 * @param {string} target - The endpoint URL or component name to trace.
 * @param {Object} graphData - The repository knowledge graph data.
 * @returns {Object} Step-by-step layer execution trace.
 */

/**
 * Generates historical repository evolution timeline and health trend data.
 * @function getTimeline
 * @param {Object} graphData - The repository knowledge graph data.
 * @returns {Object} Historical milestones and architecture evolution metrics.
 */

/**
 * Simulates structural changes and calculates blast radius before making edits.
 * @function simulateChange
 * @param {string} target - Component name or node ID to simulate modifying.
 * @param {Object} graphData - The repository knowledge graph data.
 * @returns {Object} Simulated risk score, affected endpoints, and recommended precautions.
 */

/**
 * Generates enterprise coupling density, degree centrality, and architecture drift metrics.
 * @function getEnterpriseInsights
 * @param {Object} graphData - The repository knowledge graph data.
 * @returns {Object} Enterprise architecture insights and risk coupling rank.
 */

module.exports = {
  loadConfig,
  initConfig,
  autoDetectStack,
  DEFAULT_CONFIG,
  addPlugin,
  removePlugin,
  GraphBuilder,
  calculateHealth,
  analyzeImpact,
  getContextBundle,
  explainWhy,
  detectZombieExports,
  resolveSymbol,
  MemoryEngine,
  AdrEngine,
  calculateDiff,
  evaluateAiContext,
  generateRefactoringPlan,
  runDoctor,
  searchArchitecture,
  traceFlow,
  getTimeline,
  simulateChange,
  getEnterpriseInsights,
  exportGraph,
  watchRepository,
  NodeType,
  EdgeType,
  ArchitecturalStyle
};

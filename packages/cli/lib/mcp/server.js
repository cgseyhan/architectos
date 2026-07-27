const fs = require('fs');
const path = require('path');
const readline = require('readline');

let coreModule;
try {
  coreModule = require('../core/index');
} catch (e) {
  coreModule = require('../../core/src/index');
}
const { loadConfig, GraphBuilder, calculateHealth, analyzeImpact, getContextBundle } = coreModule;

class McpServer {
  constructor(targetDir = process.cwd()) {
    this.targetDir = targetDir;
    this.config = loadConfig(targetDir);
    this.builder = new GraphBuilder(targetDir, this.config);
  }

  start() {
    console.error(`[ArchitectOS MCP] Server started for workspace: ${this.targetDir}`);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', (line) => {
      if (!line.trim()) return;
      try {
        const req = JSON.parse(line);
        this.handleRequest(req);
      } catch (err) {
        this.sendError(null, -32700, "Parse error: " + err.message);
      }
    });
  }

  handleRequest(req) {
    const { id, method, params } = req;

    if (method === 'initialize') {
      return this.sendResult(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "ArchitectOS MCP Server", version: "0.1.0" }
      });
    }

    if (method === 'tools/list') {
      return this.sendResult(id, {
        tools: [
          {
            name: "architectos_query_graph",
            description: "Retrieve repository knowledge graph, dependencies, cycles, and constitutional violations.",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "architectos_review",
            description: "Get repository architecture health score, top issues, and fix estimations.",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "architectos_why",
            description: "Analyze root causes for high component coupling and boundary violations.",
            inputSchema: {
              type: "object",
              properties: { target: { type: "string", description: "File or component name" } },
              required: ["target"]
            }
          },
          {
            name: "architectos_impact",
            description: "Analyze cross-graph downstream change impact for file, folder, symbol, or endpoint.",
            inputSchema: {
              type: "object",
              properties: { target: { type: "string", description: "Target file, directory, symbol, or API endpoint" } },
              required: ["target"]
            }
          },
          {
            name: "architectos_plan",
            description: "Generate structured refactoring migration plan and step-by-step guidance.",
            inputSchema: {
              type: "object",
              properties: { target: { type: "string", description: "Target component or module" } },
              required: ["target"]
            }
          },
          {
            name: "architectos_resolve",
            description: "Resolve symbol and verify usage, preventing AI hallucinations.",
            inputSchema: {
              type: "object",
              properties: { symbol: { type: "string", description: "Symbol name to resolve" } },
              required: ["symbol"]
            }
          },
          {
            name: "architectos_dead",
            description: "Detect unused exports, files, interfaces, and types across repository.",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "architectos_remember",
            description: "Store persistent architectural rule or constraint for AI agents in repository memory.",
            inputSchema: {
              type: "object",
              properties: {
                note: { type: "string", description: "Architectural rule or constraint note" },
                category: { type: "string", description: "Category (e.g. architecture, security, naming)" }
              },
              required: ["note"]
            }
          }
        ]
      });
    }

    if (method === 'tools/call') {
      const { name, arguments: args } = params || {};
      const graphData = this.builder.scan();

      if (name === 'architectos_query_graph' || name === 'query_repository_graph') {
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(graphData, null, 2) }] });
      }

      if (name === 'architectos_review' || name === 'architectos_get_health') {
        const health = calculateHealth(graphData, this.targetDir);
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(health, null, 2) }] });
      }

      if (name === 'architectos_why') {
        const target = (args && args.target) || 'toolbar.tsx';
        const { explainWhy } = coreModule;
        const result = explainWhy(target, graphData);
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] });
      }

      if (name === 'architectos_impact' || name === 'architectos_analyze_impact') {
        const target = (args && (args.target || args.filePath)) || 'auth.ts';
        const { analyzeImpact } = coreModule;
        const impact = analyzeImpact(target, graphData);
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(impact, null, 2) }] });
      }

      if (name === 'architectos_plan' || name === 'architectos_get_fix_plan') {
        const target = (args && args.target) || 'toolbar.tsx';
        const { generateRefactoringPlan } = coreModule;
        const plan = generateRefactoringPlan(target, graphData);
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(plan, null, 2) }] });
      }

      if (name === 'architectos_resolve') {
        const symbolQuery = (args && args.symbol) || 'WorkspaceRepository';
        const { resolveSymbol } = coreModule;
        const result = resolveSymbol(symbolQuery, graphData);
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] });
      }

      if (name === 'architectos_dead') {
        const { detectZombieExports } = coreModule;
        const result = detectZombieExports(graphData);
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] });
      }

      if (name === 'architectos_check_guard') {
        const violations = graphData.stats.totalViolations || 0;
        const cycles = graphData.stats.totalCycles || 0;
        const criticalSast = graphData.stats.sastVulnerabilities || 0;
        const passed = violations === 0 && cycles === 0 && criticalSast === 0;

        const guardStatus = {
          passed,
          violationsCount: violations,
          cyclesCount: cycles,
          sastVulnerabilitiesCount: criticalSast,
          statusMessage: passed ? "PASSED: Zero architectural regressions detected." : "BLOCKED: Architectural regression detected."
        };
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(guardStatus, null, 2) }] });
      }

      if (name === 'architectos_remember') {
        const note = (args && args.note) || '';
        const category = (args && args.category) || 'architecture';

        if (!note) {
          return this.sendError(id, -32602, "Missing required argument 'note'");
        }

        const { MemoryEngine } = coreModule;
        const memoryEngine = new MemoryEngine(this.targetDir);
        const entry = memoryEngine.remember(note, category);

        return this.sendResult(id, {
          content: [{
            type: "text",
            text: JSON.stringify({
              status: "success",
              message: "Persistent architectural rule stored successfully.",
              entry
            }, null, 2)
          }]
        });
      }

      return this.sendError(id, -32601, `Unknown tool: ${name}`);
    }

    if (method === 'notifications/initialized') {
      return; // ACK
    }

    return this.sendError(id, -32601, `Method not found: ${method}`);
  }

  sendResult(id, result) {
    console.log(JSON.stringify({ jsonrpc: "2.0", id, result }));
  }

  sendError(id, code, message) {
    console.log(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }));
  }
}

if (require.main === module) {
  const server = new McpServer();
  server.start();
}

module.exports = McpServer;

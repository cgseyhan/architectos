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
            name: "query_repository_graph",
            description: "Retrieve repository knowledge graph, dependencies, cycles, and constitutional violations.",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "get_architecture_health",
            description: "Get repository engineering health scores (Architecture, Security, Maintainability, AI Readiness, Debt).",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "analyze_impact",
            description: "Perform cross-graph impact analysis for file modification or deletion.",
            inputSchema: {
              type: "object",
              properties: {
                filePath: { type: "string", description: "Relative path of file to analyze" }
              },
              required: ["filePath"]
            }
          },
          {
            name: "get_context_bundle",
            description: "Get deterministic token-budgeted AI context bundle for a query.",
            inputSchema: {
              type: "object",
              properties: {
                query: { type: "string", description: "Search query or task topic" },
                tokenBudget: { type: "number", description: "Maximum token limit" }
              },
              required: ["query"]
            }
          }
        ]
      });
    }

    if (method === 'tools/call') {
      const { name, arguments: args } = params || {};
      const graphData = this.builder.scan();

      if (name === 'query_repository_graph') {
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(graphData, null, 2) }] });
      }

      if (name === 'get_architecture_health') {
        const health = calculateHealth(graphData);
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(health, null, 2) }] });
      }

      if (name === 'analyze_impact') {
        const filePath = (args && args.filePath) || '';
        const impact = analyzeImpact(filePath, graphData);
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(impact, null, 2) }] });
      }

      if (name === 'get_context_bundle') {
        const query = (args && args.query) || '';
        const tokenBudget = (args && args.tokenBudget) || 4096;
        const bundle = getContextBundle(query, graphData, tokenBudget);
        return this.sendResult(id, { content: [{ type: "text", text: JSON.stringify(bundle, null, 2) }] });
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

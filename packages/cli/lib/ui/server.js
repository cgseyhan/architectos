const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let coreModule;
try {
  coreModule = require('../core/index');
} catch (e) {
  coreModule = require('../../core/src/index');
}
const { loadConfig, GraphBuilder, calculateHealth, analyzeImpact, getContextBundle } = coreModule;

class UiDevServer {
  constructor(targetDir = process.cwd(), port = 4111) {
    this.targetDir = targetDir;
    this.port = port;
    this.config = loadConfig(targetDir);
    this.builder = new GraphBuilder(targetDir, this.config);
  }

  start() {
    const htmlPath = path.join(__dirname, 'dashboard.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;

      if (pathname === '/' || pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(htmlContent);
      }

      if (pathname === '/api/data') {
        const graphData = this.builder.scan();
        const health = calculateHealth(graphData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ graph: graphData, health }));
      }

      if (pathname === '/api/impact') {
        const file = parsedUrl.query.file || '';
        const graphData = this.builder.scan();
        const impact = analyzeImpact(file, graphData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(impact));
      }

      if (pathname === '/api/ask') {
        const query = parsedUrl.query.query || '';
        const graphData = this.builder.scan();
        const bundle = getContextBundle(query, graphData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(bundle));
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    });

    server.listen(this.port, () => {
      console.log(`\n==================================================`);
      console.log(`🚀 ArchitectOS Studio UI is live!`);
      console.log(`🌐 Dashboard: http://localhost:${this.port}`);
      console.log(`==================================================\n`);
    });

    return server;
  }
}

if (require.main === module) {
  const server = new UiDevServer();
  server.start();
}

module.exports = UiDevServer;

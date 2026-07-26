const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = {
  project: {
    name: "ArchitectOS Workspace",
    version: "1.0.0"
  },
  plugins: [],
  languages: ["typescript", "javascript", "python"],
  architecture: {
    style: "clean",
    rules: [
      {
        id: "ui-infrastructure-boundary",
        name: "UI cannot import Infrastructure directly",
        from: "ui",
        disallowImport: ["infrastructure", "database"]
      },
      {
        id: "no-circular-dependencies",
        name: "Forbidden Circular Import Cycles",
        type: "no-cycles"
      }
    ]
  },
  healthThresholds: {
    minArchitectureScore: 80,
    minSecurityScore: 90
  },
  ai: {
    provider: "local",
    contextTokenLimit: 8192
  }
};

/**
 * Zero-Config Stack Auto-Detector
 * Scans repository files and package.json to auto-enable framework plugins.
 */
function autoDetectStack(targetDir = process.cwd()) {
  const detectedPlugins = [];
  const detectedLanguages = ['javascript'];

  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

      if (deps['next']) detectedPlugins.push('next');
      if (deps['react']) detectedPlugins.push('react');
      if (deps['typescript'] || fs.existsSync(path.join(targetDir, 'tsconfig.json'))) {
        detectedPlugins.push('typescript');
        detectedLanguages.push('typescript');
      }
      if (deps['@prisma/client'] || deps['prisma'] || fs.existsSync(path.join(targetDir, 'prisma'))) {
        detectedPlugins.push('prisma');
      }
      if (deps['kafkajs'] || deps['confluent-kafka-javascript']) detectedPlugins.push('kafka');
      if (deps['@temporalio/workflow']) detectedPlugins.push('temporal');
      if (deps['openai']) detectedPlugins.push('openai');
    } catch (e) {}
  }

  if (fs.existsSync(path.join(targetDir, 'Dockerfile')) || fs.existsSync(path.join(targetDir, 'docker-compose.yml'))) {
    detectedPlugins.push('docker');
  }

  // Terraform detection
  const files = fs.readdirSync(targetDir);
  if (files.some(f => f.endsWith('.tf'))) {
    detectedPlugins.push('terraform');
  }

  return {
    plugins: detectedPlugins.length > 0 ? detectedPlugins : ['typescript', 'react'],
    languages: Array.from(new Set(detectedLanguages))
  };
}

function loadConfig(targetDir = process.cwd()) {
  let baseConfig = { ...DEFAULT_CONFIG };
  const configPathJson = path.join(targetDir, 'architectos.config.json');
  if (fs.existsSync(configPathJson)) {
    try {
      const raw = fs.readFileSync(configPathJson, 'utf-8');
      baseConfig = { ...baseConfig, ...JSON.parse(raw) };
    } catch (e) {
      console.warn(`[ArchitectOS] Warning parsing ${configPathJson}, using default config.`, e.message);
    }
  } else {
    const detected = autoDetectStack(targetDir);
    baseConfig = { ...baseConfig, ...detected };
  }

  // Parse .architectosignore file if present
  const ignoreFile = path.join(targetDir, '.architectosignore');
  if (fs.existsSync(ignoreFile)) {
    try {
      const ignoreLines = fs.readFileSync(ignoreFile, 'utf-8')
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#'));
      baseConfig.exclude = Array.from(new Set([...(baseConfig.exclude || []), ...ignoreLines]));
    } catch (e) {}
  }

  return baseConfig;
}

function initConfig(targetDir = process.cwd()) {
  const configPath = path.join(targetDir, 'architectos.config.json');
  const detected = autoDetectStack(targetDir);
  const finalConfig = { ...DEFAULT_CONFIG, ...detected };

  fs.writeFileSync(configPath, JSON.stringify(finalConfig, null, 2), 'utf-8');
  return { configPath, detected };
}

function addPlugin(targetDir = process.cwd(), pluginName) {
  const config = loadConfig(targetDir);
  const plugins = Array.from(new Set([...(config.plugins || []), pluginName]));
  config.plugins = plugins;
  const configPath = path.join(targetDir, 'architectos.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  return plugins;
}

function removePlugin(targetDir = process.cwd(), pluginName) {
  const config = loadConfig(targetDir);
  const plugins = (config.plugins || []).filter(p => p !== pluginName);
  config.plugins = plugins;
  const configPath = path.join(targetDir, 'architectos.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  return plugins;
}

module.exports = {
  DEFAULT_CONFIG,
  autoDetectStack,
  loadConfig,
  initConfig,
  addPlugin,
  removePlugin
};

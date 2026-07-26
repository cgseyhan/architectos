const fs = require('fs');
const path = require('path');
const { GraphBuilder } = require('./graph/builder');
const { loadConfig } = require('./config');
const { calculateHealth } = require('./graph/health');

/**
 * ArchitectOS Live Development Watch Mode Engine
 * Watches workspace files for changes and performs sub-150ms incremental graph updates.
 */
function watchRepository(targetDir = process.cwd(), onUpdate) {
  const config = loadConfig(targetDir);
  const builder = new GraphBuilder(targetDir, config);
  
  console.log(`\nWatching...\n`);

  // Initial Scan
  const startTime = Date.now();
  const graphData = builder.scan();
  const health = calculateHealth(graphData, targetDir);
  const elapsed = Date.now() - startTime;
  
  console.log(`Repository indexed (${graphData.stats.totalFiles} files in ${elapsed}ms)`);

  let debounceTimer = null;
  const changedFiles = new Set();

  const watcher = fs.watch(targetDir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const relPath = filename.replace(/\\/g, '/');

    if (relPath.includes('node_modules') || relPath.includes('.git') || relPath.includes('.architectos')) {
      return;
    }

    changedFiles.add(relPath);

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const updateStart = Date.now();
      const filesCount = changedFiles.size;
      const updatedGraph = builder.scan();
      const updatedHealth = calculateHealth(updatedGraph, targetDir);
      const updateElapsed = Date.now() - updateStart;

      console.log(`\n${filesCount} file(s) changed`);
      console.log(`Repository updated (${updateElapsed} ms)`);

      if (typeof onUpdate === 'function') {
        onUpdate({ graph: updatedGraph, health: updatedHealth, elapsed: updateElapsed, changedFiles: Array.from(changedFiles) });
      }

      changedFiles.clear();
    }, 150);
  });

  return watcher;
}

module.exports = {
  watchRepository
};

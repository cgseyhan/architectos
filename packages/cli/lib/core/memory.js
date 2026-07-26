/**
 * ArchitectOS Repository Memory Store (Layer 9: AI Memory)
 * Persistent architectural rules & guardrails for AI Agents.
 */
const fs = require('fs');
const path = require('path');

class MemoryEngine {
  constructor(targetDir = process.cwd()) {
    this.targetDir = targetDir;
    this.memoryFile = path.join(targetDir, '.architectos', 'memory.json');
  }

  getMemories() {
    if (!fs.existsSync(this.memoryFile)) return [];
    try {
      const raw = fs.readFileSync(this.memoryFile, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  remember(note, category = 'architecture') {
    const memories = this.getMemories();
    const entry = {
      id: `mem_${Date.now()}`,
      note,
      category,
      createdAt: new Date().toISOString()
    };
    memories.push(entry);

    const dir = path.dirname(this.memoryFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(this.memoryFile, JSON.stringify(memories, null, 2));
    return entry;
  }
}

module.exports = MemoryEngine;

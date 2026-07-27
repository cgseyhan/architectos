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

  checkConflict(newNote) {
    const memories = this.getMemories();
    const newNorm = newNote.toLowerCase();

    for (const mem of memories) {
      const oldNorm = mem.note.toLowerCase();
      // Check negation contradiction pairs
      const hasOpposite1 = (newNorm.includes('never') || newNorm.includes('forbidden') || newNorm.includes('not allowed')) && (oldNorm.includes('allow') || oldNorm.includes('must') || oldNorm.includes('always'));
      const hasOpposite2 = (oldNorm.includes('never') || oldNorm.includes('forbidden') || oldNorm.includes('not allowed')) && (newNorm.includes('allow') || newNorm.includes('must') || newNorm.includes('always'));

      // Check if both mention the same subject keyword (e.g. repository, ui, controller)
      const subjects = ['repository', 'ui', 'controller', 'service', 'database', 'domain'];
      const sharedSubject = subjects.find(s => newNorm.includes(s) && oldNorm.includes(s));

      if (sharedSubject && (hasOpposite1 || hasOpposite2)) {
        return {
          hasConflict: true,
          conflictingRule: mem.note
        };
      }
    }
    return { hasConflict: false };
  }

  remember(note, category = 'architecture') {
    const conflict = this.checkConflict(note);
    const memories = this.getMemories();
    const entry = {
      id: `mem_${Date.now()}`,
      note,
      category,
      hasConflict: conflict.hasConflict,
      conflictingRule: conflict.conflictingRule || null,
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

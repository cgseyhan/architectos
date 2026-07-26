/**
 * ArchitectOS Layer 14: Automated Architecture Decision Record (ADR) Engine
 */
const fs = require('fs');
const path = require('path');

class AdrEngine {
  constructor(targetDir = process.cwd()) {
    this.targetDir = targetDir;
    this.adrDir = path.join(targetDir, '.architectos', 'adrs');
  }

  generateAdr(title, reason, affectedSystems = [], migrationNotes = '') {
    if (!fs.existsSync(this.adrDir)) fs.mkdirSync(this.adrDir, { recursive: true });

    const existingFiles = fs.readdirSync(this.adrDir).filter(f => f.startsWith('ADR-'));
    const nextNum = (existingFiles.length + 1).toString().padStart(4, '0');
    const filename = `ADR-${nextNum}.md`;
    const filePath = path.join(this.adrDir, filename);

    const content = `# ADR-${nextNum}: ${title}

Date: ${new Date().toISOString().split('T')[0]}
Status: Accepted

## Context & Reason
${reason}

## Affected Systems & Components
${affectedSystems.map(s => `- ${s}`).join('\n') || '- Entire Workspace'}

## Migration & Implementation Notes
${migrationNotes || 'No breaking changes. Automated structural refactoring.'}
`;

    fs.writeFileSync(filePath, content, 'utf-8');
    return { id: `ADR-${nextNum}`, title, filePath, content };
  }
}

module.exports = AdrEngine;

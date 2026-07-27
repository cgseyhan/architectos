/**
 * ArchitectOS Taint Engine — Sink Registry
 * Defines dangerous execution sinks where untrusted data must not arrive without sanitization.
 */

const TAINT_SINKS = [
  // SQL Sinks
  { name: 'db.query', category: 'SQLI', pattern: /(?:db|sequelize|knex|prisma)\.(?:query|raw|execute)\s*\(/i },

  // HTML / DOM Sinks
  { name: 'innerHTML', category: 'XSS', pattern: /innerHTML\s*=/i },
  { name: 'dangerouslySetInnerHTML', category: 'XSS', pattern: /dangerouslySetInnerHTML\s*=/i }, // nosec

  // Command Execution Sinks
  { name: 'exec', category: 'RCE', pattern: /(?:child_process|cp)\.(?:exec|execSync|spawn|spawnSync)\s*\(/i },

  // File System Sinks
  { name: 'fs.readFile', category: 'PATH_TRAVERSAL', pattern: /fs\.(?:readFile|readFileSync|createReadStream)\s*\(/i },

  // Redirect Sinks
  { name: 'res.redirect', category: 'OPEN_REDIRECT', pattern: /res\.redirect\s*\(/i },
];

module.exports = { TAINT_SINKS };

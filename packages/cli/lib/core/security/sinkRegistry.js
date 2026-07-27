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

  // Python Sinks
  { name: 'pickle.loads', category: 'PYTHON_DESERIALIZATION', pattern: /pickle\.(?:loads|load)\s*\(/i },
  { name: 'yaml.unsafe_load', category: 'PYTHON_YAML', pattern: /yaml\.(?:unsafe_load|load\([^)]*Loader\s*=\s*yaml\.(?:Loader|UnsafeLoader))/i },
  { name: 'os.system', category: 'PYTHON_RCE', pattern: /(?:os\.system|os\.popen|subprocess\.(?:Popen|call|run))\s*\(/i },
  { name: 'cursor.execute', category: 'PYTHON_SQLI', pattern: /cursor\.execute\s*\(\s*(?:f["']|["'].*?%|.*?\+)/i },
];

module.exports = { TAINT_SINKS };

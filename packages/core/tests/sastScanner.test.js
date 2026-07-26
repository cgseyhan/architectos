const { scanCodeForVulnerabilities, SAST_RULES } = require('../src/security/sastScanner');

describe('ArchitectOS High-Precision SAST Engine Tests', () => {
  test('should detect SQL Injection vulnerability', () => {
    const code = `const query = "SELECT * FROM users WHERE id = " + req.query.id;`;
    const vulns = scanCodeForVulnerabilities(code, 'app/db.js');
    expect(vulns.length).toBeGreaterThan(0);
    expect(vulns[0].ruleId).toBe('SAST-SQLI-001');
    expect(vulns[0].confidence).toBe('100%');
  });

  test('should detect Dangerous DOM Injection (XSS)', () => {
    const code = `<div dangerouslySetInnerHTML={{ __html: userInput }} />`;
    const vulns = scanCodeForVulnerabilities(code, 'app/Component.tsx');
    expect(vulns.length).toBeGreaterThan(0);
    expect(vulns[0].ruleId).toBe('SAST-XSS-001');
  });

  test('should detect Process Execution (RCE)', () => {
    const code = `const exec = require('child_process').exec; exec(req.query.cmd);`;
    const vulns = scanCodeForVulnerabilities(code, 'app/server.js');
    expect(vulns.length).toBeGreaterThan(0);
    expect(vulns[0].ruleId).toBe('SAST-RCE-001');
  });

  test('should detect Hardcoded Secret Keys', () => {
    const code = `const apiKey = "AKIAIOSFODNN7EXAMPLE";`;
    const vulns = scanCodeForVulnerabilities(code, 'app/config.js');
    expect(vulns.length).toBeGreaterThan(0);
    expect(vulns[0].ruleId).toBe('SAST-SECRET-001');
  });

  test('should honor inline suppression comments (architectos-ignore)', () => {
    const code = `// architectos-ignore\nconst query = "SELECT * FROM users WHERE id = " + req.query.id;`;
    const vulns = scanCodeForVulnerabilities(code, 'app/db.js');
    expect(vulns.length).toBe(0);
  });
});

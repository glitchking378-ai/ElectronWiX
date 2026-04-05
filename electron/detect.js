const { execFile } = require('child_process');
const util = require('util');

const execFileAsync = util.promisify(execFile);

async function regQuery(hive, key, valueName) {
  const full = `${hive}\\${key}`;
  const args = ['query', full];
  if (valueName) args.push('/v', valueName);

  try {
    const { stdout } = await execFileAsync('reg.exe', args, { windowsHide: true });
    return { found: true, stdout };
  } catch {
    return { found: false, stdout: '' };
  }
}

async function msiProductInstalled(productCode) {
  try {
    const script = `[bool](Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*','HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*' -ErrorAction SilentlyContinue | Where-Object { $_.PSChildName -eq '${productCode}' })`;
    const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script], { windowsHide: true });
    return stdout.trim().toLowerCase() === 'true';
  } catch {
    return false;
  }
}

async function detectPackage(pkg) {
  const rule = pkg.detect;
  if (!rule) return { present: false, reason: 'No detection rule' };

  if (rule.kind === 'registryExists') {
    const result = await regQuery(rule.hive, rule.key, rule.valueName);
    if (!result.found) return { present: false, reason: 'Registry key/value not found' };

    if (typeof rule.equals !== 'undefined') {
      return {
        present: result.stdout.includes(String(rule.equals)),
        reason: 'Registry value comparison'
      };
    }

    return { present: true, reason: 'Registry key/value exists' };
  }

  if (rule.kind === 'msiProductCode') {
    const present = await msiProductInstalled(rule.productCode);
    return { present, reason: present ? 'Product code detected' : 'Product code not detected' };
  }

  return { present: false, reason: `Unsupported detection kind: ${rule.kind}` };
}

module.exports = { detectPackage };
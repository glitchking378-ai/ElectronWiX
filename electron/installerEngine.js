const { spawn } = require('child_process');
const packages = require('./packages');
const { detectPackage } = require('./detect');

function emit(type, payload) {
  if (global.__installerWindow) {
    global.__installerWindow.webContents.send('installer:event', { type, ...payload });
  }
}

async function detectAll() {
  emit('detect-begin');
  const results = [];
  for (const pkg of packages) {
    const res = await detectPackage(pkg);
    results.push({ ...pkg, present: res.present });
    emit('package-detected', { packageId: pkg.id, present: res.present, reason: res.reason });
  }
  emit('detect-complete');
  return results;
}

async function applyInstall(context) {
  const detected = await detectAll();

  emit('apply-begin');

  for (const pkg of detected) {
    if (pkg.present) {
      emit('package-skipped', { packageId: pkg.id, reason: 'Already installed' });
      continue;
    }

    emit('package-begin', { packageId: pkg.id, name: pkg.name });

    const args = pkg.type === 'msi'
      ? ['/i', pkg.path, '/passive', '/norestart']
      : pkg.installArgs;

    const proc = spawn(pkg.type === 'msi' ? 'msiexec.exe' : pkg.path, args);

    proc.stdout?.on('data', d => emit('package-log', { line: d.toString() }));
    proc.stderr?.on('data', d => emit('package-log', { line: d.toString() }));

    const code = await new Promise(res => proc.on('exit', res));

    if (code !== 0) {
      emit('package-failed', { packageId: pkg.id, exitCode: code });
      return emit('apply-complete', { success: false });
    }

    emit('package-complete', { packageId: pkg.id, exitCode: code });
  }

  emit('apply-complete', { success: true });
}

module.exports = { applyInstall };
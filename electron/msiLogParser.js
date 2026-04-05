const fs = require('fs');

function readTail(filePath, maxBytes = 12000) {
  if (!fs.existsSync(filePath)) return '';
  const stat = fs.statSync(filePath);
  const start = Math.max(0, stat.size - maxBytes);
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(stat.size - start);
  fs.readSync(fd, buffer, 0, buffer.length, start);
  fs.closeSync(fd);
  return buffer.toString('utf8');
}

function parseMsiTail(filePath) {
  const tail = readTail(filePath);
  const lines = tail.split(/\r?\n/).filter(Boolean);
  const last = lines.slice(-8);
  let phase = 'Executing';

  for (const line of last) {
    if (/InstallFiles/i.test(line)) phase = 'Copying files';
    if (/WriteRegistryValues/i.test(line)) phase = 'Writing registry';
    if (/CreateShortcuts/i.test(line)) phase = 'Creating shortcuts';
    if (/PublishProduct/i.test(line)) phase = 'Publishing product';
    if (/completed successfully/i.test(line)) phase = 'MSI completed';
  }

  return { phase, lastLines: last };
}

module.exports = { parseMsiTail };
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { applyInstall } = require('./installerEngine');

function createWindow() {
  const win = new BrowserWindow({
    width: 940,
    height: 610,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  global.__installerWindow = win;

  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);

ipcMain.handle('installer:start', async (_, payload) => {
  await applyInstall({ installDir: payload.installDir });
});
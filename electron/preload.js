const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('installerApi', {
  startInstall: (installDir) => ipcRenderer.invoke('installer:start', { installDir }),
  onEvent: (callback) => {
    const handler = (_, payload) => callback(payload);
    ipcRenderer.on('installer:event', handler);
    return () => ipcRenderer.removeListener('installer:event', handler);
  }
});
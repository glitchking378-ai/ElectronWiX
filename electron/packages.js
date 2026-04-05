const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');

module.exports = [
  {
    id: 'vcpp',
    name: 'VC++ Runtime',
    type: 'exe',
    path: path.join(ASSETS, 'vc_redist.x64.exe'),
    installArgs: ['/install', '/quiet', '/norestart'],
    uninstallArgs: ['/uninstall', '/quiet', '/norestart'],
    detect: {
      kind: 'registryExists',
      hive: 'HKLM',
      key: 'SOFTWARE\\Microsoft\\VisualStudio\\14.0\\VC\\Runtimes\\x64',
      valueName: 'Installed',
      equals: 1
    },
    vital: true,
    estimatedSizeMb: 28
  },
  {
    id: 'webview2',
    name: 'WebView2 Runtime',
    type: 'exe',
    path: path.join(ASSETS, 'MicrosoftEdgeWebView2Setup.exe'),
    installArgs: ['/silent', '/install'],
    uninstallArgs: [],
    detect: {
      kind: 'registryExists',
      hive: 'HKLM',
      key: 'SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate\\Clients\\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}',
      valueName: 'pv',
      exists: true
    },
    vital: true,
    estimatedSizeMb: 142
  },
  {
    id: 'app',
    name: 'My App',
    type: 'msi',
    path: path.join(ASSETS, 'MyApp.msi'),
    installArgs: ['INSTALLFOLDER=[INSTALL_DIR]'],
    uninstallArgs: [],
    productCode: '{PUT-YOUR-PRODUCT-CODE-HERE}',
    logName: 'myapp-msi.log',
    detect: {
      kind: 'msiProductCode',
      productCode: '{PUT-YOUR-PRODUCT-CODE-HERE}'
    },
    vital: true,
    estimatedSizeMb: 57
  }
];
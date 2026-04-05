import React, { useEffect, useState } from 'react';

export default function App() {
  const [logs, setLogs] = useState(['Ready.']);

  useEffect(() => {
    window.installerApi.onEvent((event) => {
      if (event.line) {
        setLogs((prev) => [...prev, event.line]);
      }
    });
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'Segoe UI' }}>
      <h2>Electron WiX Installer</h2>
      <button onClick={() => window.installerApi.startInstall('C:\\Program Files\\My App')}>
        Install
      </button>

      <pre style={{ marginTop: 20, height: 200, overflow: 'auto' }}>
        {logs.join('\n')}
      </pre>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import './styles.css';

export default function App() {
  const [packages, setPackages] = useState([
    { id: 'vcpp', name: 'VC++ Runtime', status: 'waiting' },
    { id: 'webview2', name: 'WebView2 Runtime', status: 'waiting' },
    { id: 'app', name: 'My App', status: 'waiting' }
  ]);

  const [status, setStatus] = useState('Ready');
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.installerApi.onEvent((e) => {
      if (e.type === 'package-begin') {
        setStatus(`Installing ${e.name}`);
        setPackages(p =>
          p.map(pkg => pkg.id === e.packageId ? { ...pkg, status: 'installing' } : pkg)
        );
      }

      if (e.type === 'package-complete') {
        setPackages(p =>
          p.map(pkg => pkg.id === e.packageId ? { ...pkg, status: 'installed' } : pkg)
        );
        setProgress(prev => prev + 33);
      }

      if (e.type === 'package-failed') {
        setPackages(p =>
          p.map(pkg => pkg.id === e.packageId ? { ...pkg, status: 'failed' } : pkg)
        );
        setStatus('Failed');
      }

      if (e.type === 'apply-complete') {
        setStatus('Completed');
      }

      if (e.line) {
        setLogs(l => [...l, e.line]);
      }
    });
  }, []);

  return (
    <div className="shell">
      <div className="titlebar">My App Setup</div>

      <div className="main">
        <div className="sidebar">
          <h1>Setup</h1>
          <p>Installing My App</p>
        </div>

        <div className="content">
          <h2>Installing My App</h2>

          <div className="pkg-table">
            {packages.map(pkg => (
              <div key={pkg.id} className={`pkg ${pkg.status}`}>
                <span>{pkg.name}</span>
                <span>{pkg.status}</span>
              </div>
            ))}
          </div>

          <div className="progress">
            <div style={{ width: progress + '%' }} />
          </div>

          <div className="status">{status}</div>

          <div className="log">
            {logs.map((l,i)=><div key={i}>{l}</div>)}
          </div>
        </div>
      </div>

      <div className="footer">
        <span>{status}</span>
        <button onClick={()=>window.installerApi.startInstall('C:\\Program Files\\My App')}>
          Install
        </button>
      </div>
    </div>
  )

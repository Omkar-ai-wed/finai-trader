'use client';
import { useState } from 'react';

type ApiKey = { name: string; key: string; added: string };

const DEMO_KEYS: ApiKey[] = [
  { name: 'Binance Main',   key: 'sk_live****f26b', added: '2025-03-12' },
  { name: 'Twitter Bearer', key: 'AAA****xRT7',      added: '2025-02-14' },
];

export default function SettingsPage() {
  const [keys, setKeys]         = useState<ApiKey[]>(DEMO_KEYS);
  const [newName, setNewName]   = useState('');
  const [newKey, setNewKey]     = useState('');
  const [jwt, setJwt]           = useState('your-super-secret-jwt-key-here');
  const [expiry, setExpiry]     = useState('60');
  const [theme, setTheme]       = useState('Dark');
  const [notif, setNotif]       = useState(true);
  const [sounds, setSounds]     = useState(false);
  const [saved, setSaved]       = useState(false);

  const addKey = () => {
    if (!newName || !newKey) return;
    const masked = newKey.slice(0, 4) + '****' + newKey.slice(-4);
    setKeys(k => [...k, { name: newName, key: masked, added: new Date().toISOString().slice(0, 10) }]);
    setNewName(''); setNewKey('');
  };
  const removeKey = (i: number) => setKeys(k => k.filter((_, idx) => idx !== i));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="page-content">
      <div>
        <div className="accent-line" />
        <h1 className="section-title text-gradient-cyan-violet">Settings</h1>
        <p className="section-subtitle">Manage API keys, security, and platform preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* API Keys */}
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">🔑 API Keys</p>
          <div className="flex flex-col gap-2 mb-3">
            {keys.map((k, i) => (
              <div key={i} className="alert-item justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/90">{k.name}</p>
                  <p className="font-mono text-xs text-white/30 mt-0.5">{k.key} · Added {k.added}</p>
                </div>
                <button onClick={() => removeKey(i)} className="btn btn-red text-xs py-1 px-2 shrink-0">🗑</button>
              </div>
            ))}
            {keys.length === 0 && (
              <p className="text-sm text-white/25 text-center py-4">No API keys configured</p>
            )}
          </div>
          <hr className="glass-divider mb-3" />
          <p className="metric-label mb-2">Add New Key</p>
          <div className="flex flex-col gap-2">
            <input value={newName} onChange={e => setNewName(e.target.value)}
              className="glass-input" placeholder="Key name (e.g. Binance API)" />
            <div className="flex gap-2">
              <input value={newKey} onChange={e => setNewKey(e.target.value)} type="password"
                className="glass-input font-mono" placeholder="API key value" />
              <button onClick={addKey} className="btn btn-cyan shrink-0">+ Add</button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">🔒 Security</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="metric-label mb-1 block">JWT Secret Key</label>
              <input value={jwt} onChange={e => setJwt(e.target.value)} type="password"
                className="glass-input font-mono" />
            </div>
            <div>
              <label className="metric-label mb-1 block">Token Expiry (minutes)</label>
              <input value={expiry} onChange={e => setExpiry(e.target.value)}
                className="glass-input font-mono" />
            </div>
            <div className="glass-card p-3" style={{background:'rgba(255,61,110,0.04)',borderColor:'rgba(255,61,110,0.15)'}}>
              <p className="text-[0.7rem] text-[#ff3d6e]/70">
                ⚠ Never commit JWT secrets to version control. Use environment variables in production.
              </p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">🎨 Preferences</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="metric-label mb-1 block">Color Scheme</label>
              <select value={theme} onChange={e => setTheme(e.target.value)} className="glass-input">
                {['Dark (Glassmorphism)', 'Dark (Cyberpunk)', 'Light (FinTech)', 'System Default'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Fraud Alert Notifications', sub: 'Push alerts for high-risk detections', state: notif, set: setNotif },
                { label: 'Sound Effects',              sub: 'Play sounds on trade signals',          state: sounds, set: setSounds },
              ].map(({ label, sub, state, set }) => (
                <div key={label} className="flex items-center justify-between gap-3 alert-item">
                  <div>
                    <p className="text-sm text-white/80">{label}</p>
                    <p className="text-[0.65rem] text-white/30 mt-0.5">{sub}</p>
                  </div>
                  <label className="toggle-switch shrink-0">
                    <input type="checkbox" checked={state} onChange={() => set(!state)} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">ℹ️ About Platform</p>
          <div className="flex flex-col gap-2">
            {[
              ['Version',    'v2.0.0-demo'],
              ['Backend',    'FastAPI 0.115 · Python 3.13'],
              ['Frontend',   'Next.js 14 · TailwindCSS'],
              ['AI Models',  'FinBERT (fallback) · GNN fraud'],
              ['Database',   'SQLite (local) / PostgreSQL (prod)'],
              ['GitHub',     'github.com/Omkar-ai-wed/finai-trader'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
                <span className="text-xs text-white/30 uppercase tracking-wider">{k}</span>
                <span className="font-mono text-xs text-white/60">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <a href="https://github.com/Omkar-ai-wed/finai-trader" target="_blank"
              className="btn btn-ghost text-xs py-1.5 flex-1 justify-center">
              ⭐ View on GitHub
            </a>
            <a href="http://localhost:8000/docs" target="_blank"
              className="btn btn-violet text-xs py-1.5 flex-1 justify-center">
              📚 API Docs
            </a>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button onClick={save} className="btn btn-cyan px-8 py-3">
          {saved ? '✅ Saved!' : '💾 Save Settings'}
        </button>
        <button className="btn btn-ghost">↺ Reset Defaults</button>
        {saved && <span className="text-[#10ffd1] text-sm animate-fade-in">Settings applied successfully</span>}
      </div>
    </div>
  );
}

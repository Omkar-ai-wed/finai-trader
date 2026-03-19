"use client";

import { useState } from "react";

type ApiKey = { id: number; name: string; preview: string; created: string };

const INITIAL_KEYS: ApiKey[] = [
  { id: 1, name: "Binance Main",    preview: "BN_ak_****...f2e8", created: "2025-03-01" },
  { id: 2, name: "Twitter Bearer",  preview: "AAAA****...xk9f", created: "2025-02-14" },
];

export default function SettingsPage() {
  const [keys, setKeys]             = useState(INITIAL_KEYS);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyVal, setNewKeyVal]   = useState("");
  const [jwt, setJwt]               = useState("super-secret-key-change-this");
  const [jwtExpiry, setJwtExpiry]   = useState("60");
  const [theme, setTheme]           = useState("dark");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved]           = useState(false);

  const addKey = () => {
    if (!newKeyName || !newKeyVal) return;
    setKeys((p) => [...p, {
      id: Date.now(),
      name: newKeyName,
      preview: newKeyVal.slice(0, 8) + "****...",
      created: new Date().toISOString().slice(0, 10),
    }]);
    setNewKeyName(""); setNewKeyVal("");
  };

  const deleteKey = (id: number) => setKeys((p) => p.filter((k) => k.id !== id));

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage API keys, security, and platform preferences</p>
      </div>

      {/* API Keys */}
      <div className="card border-neonBlue/20 p-5">
        <div className="text-sm font-semibold text-white mb-4">🔑 API Keys</div>
        <div className="space-y-2 mb-4">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between px-3 py-2.5 border border-white/5 rounded-lg">
              <div>
                <div className="text-sm text-white">{k.name}</div>
                <div className="text-xs mono text-gray-400">{k.preview} · Added {k.created}</div>
              </div>
              <button onClick={() => deleteKey(k.id)} className="btn btn-ghost text-xs px-2 py-1 text-danger">🗑 Remove</button>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-4">
          <div className="text-xs text-gray-400 mb-3">Add New Key</div>
          <div className="flex gap-2 mb-2">
            <input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)}
              className="input flex-1" placeholder="Key name (e.g. Binance API)" />
          </div>
          <div className="flex gap-2">
            <input value={newKeyVal} onChange={(e) => setNewKeyVal(e.target.value)}
              className="input flex-1 font-mono" type="password" placeholder="API key value" />
            <button onClick={addKey} className="btn btn-blue">Add</button>
          </div>
        </div>
      </div>

      {/* JWT Security */}
      <div className="card border-neonBlue/20 p-5">
        <div className="text-sm font-semibold text-white mb-4">🔐 JWT Security</div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">JWT Secret Key</label>
            <input value={jwt} onChange={(e) => setJwt(e.target.value)}
              className="input w-full font-mono text-xs" type="password" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Token Expiry (minutes)</label>
            <input value={jwtExpiry} onChange={(e) => setJwtExpiry(e.target.value)}
              className="input w-40 font-mono" type="number" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card border-neonBlue/20 p-5">
        <div className="text-sm font-semibold text-white mb-4">⚙ Preferences</div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white">Theme</div>
              <div className="text-xs text-gray-400">UI color scheme</div>
            </div>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}
              className="input w-32">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white">Fraud Alert Notifications</div>
              <div className="text-xs text-gray-400">Push alerts for high-risk wallets</div>
            </div>
            <button
              onClick={() => setNotifications((p) => !p)}
              className={`w-10 h-5 rounded-full transition-colors ${notifications ? "bg-finGreen/70" : "bg-gray-700"} flex items-center`}>
              <span className={`w-4 h-4 rounded-full bg-white transition-transform mx-0.5 ${notifications ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Save */}
      <button onClick={saveSettings} className={`btn ${saved ? "btn-green" : "btn-blue"} px-6`}>
        {saved ? "✅ Saved!" : "💾 Save Settings"}
      </button>
    </div>
  );
}

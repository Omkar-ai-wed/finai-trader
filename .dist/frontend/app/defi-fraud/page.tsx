'use client';
import { useState, useEffect } from 'react';
import NetworkGraph from '@/components/NetworkGraph';

type Alert = { address: string; risk: number; type: string; ts: string };
type GraphState = {
  nodes: string[];
  edges: { from: string; to: string }[];
  nodeScores: Record<string, number>;
};

export default function DeFiFraudPage() {
  const [wallet, setWallet]     = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult]     = useState<{risk:number;type:string;nodes:number;edges:number}|null>(null);
  const [graph, setGraph]       = useState<GraphState>({ nodes: [], edges: [], nodeScores: {} });
  const [alerts, setAlerts]     = useState<Alert[]>([]);

  useEffect(() => {
    setAlerts([
      { address: '0x9f3a…d8c2', risk: 0.87, type: 'Rug Pull',     ts: '12:04:11' },
      { address: '0x2b7e…f1a9', risk: 0.63, type: 'Laundering',   ts: '12:02:55' },
      { address: '0x5c1d…7b30', risk: 0.91, type: 'Cluster Risk',  ts: '11:59:33' },
    ]);
  }, []);

  const scan = async () => {
    if (!wallet.trim()) return;
    setScanning(true);
    await new Promise(r => setTimeout(r, 1200));
    const risk  = +(Math.random() * 0.85 + 0.05).toFixed(3);
    const types = ['Rug Pull', 'Money Laundering', 'Cluster Risk', 'Wash Trading', 'Sybil Attack'];
    const type  = types[Math.floor(Math.random() * types.length)];
    const n     = Math.floor(Math.random() * 18) + 6;

    const nodeIds: string[] = Array.from({ length: n }, (_, i) => `n${i}`);
    const nodeScores: Record<string, number> = {};
    nodeIds.forEach(id => { nodeScores[id] = +Math.random().toFixed(3); });
    const edges = nodeIds.slice(1).map((_, i) => ({
      from: `n${Math.floor(Math.random() * (i + 1))}`,
      to:   `n${i + 1}`,
    }));

    setGraph({ nodes: nodeIds, edges, nodeScores });
    setResult({ risk, type, nodes: n, edges: edges.length });
    setAlerts(a => [
      { address: wallet.slice(0, 6) + '…' + wallet.slice(-4), risk, type, ts: new Date().toLocaleTimeString() },
      ...a.slice(0, 9),
    ]);
    setScanning(false);
  };

  const riskBadge = (r: number) => r >= 0.7 ? 'badge-red' : r >= 0.4 ? 'badge-amber' : 'badge-green';
  const riskText  = (r: number) => r >= 0.7 ? 'text-glow-red' : r >= 0.4 ? 'text-glow-amber' : 'text-glow-green';

  return (
    <div className="page-content">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="accent-line" />
          <h1 className="section-title text-gradient-cyan-violet">DeFi Fraud Detection</h1>
          <p className="section-subtitle">Graph Neural Network–powered blockchain fraud analysis</p>
        </div>
      </div>

      {/* Scanner */}
      <div className="glass-card p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">Wallet Scanner</p>
        <div className="flex gap-2">
          <input value={wallet} onChange={e => setWallet(e.target.value)}
            className="glass-input" placeholder="Enter wallet address (e.g. 0x…)" />
          <button onClick={scan} disabled={scanning} className="btn btn-cyan shrink-0">
            {scanning ? '⏳ Scanning…' : '🔍 Scan Wallet'}
          </button>
        </div>
        {result && (
          <div className="mt-3 flex flex-wrap gap-3 items-center animate-fade-in">
            <div className="flex items-center gap-2">
              <p className="text-xs text-white/40 uppercase tracking-widest">Risk Score</p>
              <p className={`font-mono font-bold text-xl ${riskText(result.risk)}`}>{(result.risk * 100).toFixed(1)}%</p>
            </div>
            <span className={`badge ${riskBadge(result.risk)}`}>{result.type}</span>
            <span className="badge badge-violet">{result.nodes} Nodes</span>
            <span className="badge badge-cyan">{result.edges} Edges</span>
          </div>
        )}
      </div>

      {/* Graph + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <div className="glass-card p-4 lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Transaction Network Graph</p>
          <div className="graph-container" style={{ height: 300 }}>
            <NetworkGraph nodes={graph.nodes} edges={graph.edges} nodeScores={graph.nodeScores} />
          </div>
          {!result && (
            <p className="text-center text-sm text-white/20 mt-3">Scan a wallet to visualize the transaction network</p>
          )}
        </div>
        <div className="glass-card p-4 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
            Live Alerts <span className="ml-1 text-white/20">{alerts.length}</span>
          </p>
          <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
            {alerts.map((a, i) => (
              <div key={i} className="alert-item">
                <div className={`alert-dot shrink-0 mt-1 ${a.risk >= 0.7 ? 'bg-[#ff3d6e]' : a.risk >= 0.4 ? 'bg-[#fbbf24]' : 'bg-[#10ffd1]'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono text-white/70 truncate">{a.address}</p>
                  <p className="text-[0.65rem] text-white/30">{a.type} · {a.ts}</p>
                </div>
                <span className={`badge ${riskBadge(a.risk)} shrink-0`}>{(a.risk * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        {['Analyze Transaction Graph', 'Detect Fraud Pattern', 'Load Blockchain Dataset', 'Generate Fraud Report'].map(b => (
          <button key={b} className="btn btn-ghost">{b}</button>
        ))}
      </div>
    </div>
  );
}

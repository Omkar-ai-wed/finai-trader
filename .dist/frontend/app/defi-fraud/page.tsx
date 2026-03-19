"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import NetworkGraph from "@/components/NetworkGraph";

type Alert = { id?: number; wallet_address: string; risk_score: number; alert_type: string; created_at?: string };
type GraphData = { nodes: { id: string; label: string }[]; edges: { from: string; to: string; value: number }[] };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";
const WS_BASE  = process.env.NEXT_PUBLIC_WS_BASE  || "ws://localhost:8000";
const TOKEN    = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
const api = () => axios.create({
  baseURL: API_BASE,
  headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
});

function riskColor(s: number) {
  if (s > 0.75) return "text-danger";
  if (s > 0.5)  return "text-orange-400";
  if (s > 0.3)  return "text-yellow-400";
  return "text-finGreen";
}

export default function DeFiFraudPage() {
  const [wallet, setWallet]           = useState("");
  const [alert, setAlert]             = useState<Alert | null>(null);
  const [graphData, setGraphData]     = useState<GraphData>({ nodes: [], edges: [] });
  const [nodeScores, setNodeScores]   = useState<Record<string, number>>({});
  const [loading, setLoading]         = useState(false);
  const [patterns, setPatterns]       = useState<any[]>([]);
  const [liveAlerts, setLiveAlerts]   = useState<Alert[]>([]);

  // WebSocket
  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/fraud`);
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "fraud_alert") {
        setLiveAlerts((p) => [{ wallet_address: d.wallet_address, risk_score: d.risk_score, alert_type: d.alert_type || "scan" }, ...p.slice(0, 9)]);
      }
    };
    return () => ws.close();
  }, []);

  const scanWallet = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const res = await api().post("/fraud/scan_wallet", { wallet_address: wallet, chain: "bitcoin" });
      setAlert(res.data);
      if (res.data.graph) {
        setGraphData(res.data.graph);
        setNodeScores(res.data.node_scores ?? {});
      }
    } catch {
      // Demo fallback
      const mockNodes = [wallet, "0xABC...123", "0xDEF...456", "0xGHI...789", "0xJKL...012"];
      setGraphData({
        nodes: mockNodes.map((id) => ({ id, label: id.slice(0, 10) })),
        edges: [
          { from: wallet, to: "0xABC...123", value: 1.2 },
          { from: "0xABC...123", to: "0xDEF...456", value: 0.8 },
          { from: "0xDEF...456", to: "0xGHI...789", value: 2.4 },
          { from: wallet, to: "0xJKL...012", value: 0.3 },
        ],
      });
      const score = Math.random() * 0.9;
      setNodeScores({ [wallet]: score, "0xABC...123": Math.random() * 0.4, "0xDEF...456": Math.random() * 0.8 });
      setAlert({ wallet_address: wallet, risk_score: score, alert_type: score > 0.75 ? "rug_pull" : score > 0.5 ? "laundering" : "clean" });
    }
    setLoading(false);
  };

  const detectPatterns = async () => {
    try {
      const res = await api().post("/fraud/detect_pattern", { chain: "bitcoin" });
      if (res.data.patterns) setPatterns(res.data.patterns);
    } catch {}
  };

  const generateReport = () => {
    if (!alert) return;
    const txt = `# Fraud Analysis Report\nWallet: ${alert.wallet_address}\nRisk Score: ${(alert.risk_score * 100).toFixed(1)}%\nAlert Type: ${alert.alert_type}\nGenerated: ${new Date().toISOString()}`;
    const blob = new Blob([txt], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `fraud_report_${alert.wallet_address.slice(0, 8)}.txt`; a.click();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">DeFi Fraud Detection</h1>
        <p className="text-gray-400 text-sm mt-0.5">Graph Neural Network–powered blockchain fraud analysis</p>
      </div>

      {/* Wallet scan bar */}
      <div className="flex gap-2">
        <input value={wallet} onChange={(e) => setWallet(e.target.value)}
          className="input flex-1 font-mono" placeholder="Enter wallet address (e.g. 0xAbC...)" />
        <button onClick={scanWallet} disabled={loading || !wallet}
          className="btn btn-blue whitespace-nowrap">
          {loading ? "Scanning..." : "🔍 Scan Wallet"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Graph + action panel */}
        <div className="xl:col-span-2 space-y-4">
          <NetworkGraph
            nodes={graphData.nodes}
            edges={graphData.edges}
            nodeScores={nodeScores}
          />

          {/* Risk result card */}
          {alert && (
            <div className={`card p-4 border ${alert.risk_score > 0.75 ? "border-danger/40 glow-red" : alert.risk_score > 0.5 ? "border-orange-400/30" : "border-finGreen/30"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-white">Scan Result</div>
                <span className={`text-xs font-mono ${riskColor(alert.risk_score)}`}>
                  {alert.alert_type.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-gray-400 text-xs mb-0.5">Risk Score</div>
                  <div className={`text-2xl font-bold mono ${riskColor(alert.risk_score)}`}>
                    {(alert.risk_score * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-0.5">Wallet</div>
                  <div className="text-white mono text-xs">{alert.wallet_address.slice(0, 18)}…</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-0.5">Verdict</div>
                  <div className={`font-semibold ${riskColor(alert.risk_score)}`}>
                    {alert.risk_score > 0.75 ? "⚠ HIGH RISK" : alert.risk_score > 0.5 ? "⚡ SUSPICIOUS" : alert.risk_score > 0.3 ? "❓ WATCH" : "✅ CLEAN"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detected patterns */}
          {patterns.length > 0 && (
            <div className="card border-neonBlue/20 p-4">
              <div className="text-sm font-semibold text-white mb-3">Detected Patterns ({patterns.length})</div>
              <div className="space-y-1.5">
                {patterns.map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                    <span className="mono text-gray-300">{p.wallet}</span>
                    <span className="badge badge-red">{p.pattern}</span>
                    <span className={`mono ${riskColor(p.risk_score)}`}>{(p.risk_score * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Action buttons */}
          <div className="card border-neonBlue/20 p-4 space-y-2">
            <div className="text-sm font-semibold text-white mb-1">Fraud Controls</div>
            <button onClick={scanWallet} className="btn btn-blue w-full">🔍 Scan Wallet</button>
            <button onClick={() => {}} className="btn btn-ghost w-full">📊 Analyze Transaction Graph</button>
            <button onClick={detectPatterns} className="btn btn-ghost w-full">🕵️ Detect Fraud Pattern</button>
            <button className="btn btn-ghost w-full">📂 Load Blockchain Dataset</button>
            <button onClick={generateReport} disabled={!alert} className="btn btn-ghost w-full">📄 Generate Fraud Report</button>
          </div>

          {/* Live alert feed */}
          <div className="card border-neonBlue/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-white">Live Alerts</div>
              {liveAlerts.length > 0 && <span className="pulse-dot" style={{ background: "#ff4444" }} />}
            </div>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {liveAlerts.map((a, i) => (
                <div key={i} className="text-xs border border-white/5 rounded p-2 animate-fade-in">
                  <div className="flex justify-between mb-0.5">
                    <span className="mono text-gray-400">{a.wallet_address.slice(0, 14)}…</span>
                    <span className={`mono font-semibold ${riskColor(a.risk_score)}`}>
                      {(a.risk_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="badge badge-red">{a.alert_type}</span>
                </div>
              ))}
              {!liveAlerts.length && <div className="text-xs text-gray-500">No alerts yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

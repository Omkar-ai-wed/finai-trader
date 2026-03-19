"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import SentimentGauge from "@/components/SentimentGauge";
import SentimentTrendChart from "@/components/SentimentTrendChart";

type Result = { label: string; score: number; text?: string };
type TrendPoint = { time: string; bullish: number; neutral: number; bearish: number };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";
const WS_BASE  = process.env.NEXT_PUBLIC_WS_BASE  || "ws://localhost:8000";
const TOKEN    = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
const api = () => axios.create({
  baseURL: API_BASE,
  headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
});

export default function SentimentPage() {
  const [query, setQuery]     = useState("bitcoin");
  const [results, setResults] = useState<Result[]>([]);
  const [avgScore, setAvgScore] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [trend, setTrend]     = useState<TrendPoint[]>([]);
  const [liveUpdates, setLiveUpdates] = useState<Result[]>([]);

  // WebSocket for live updates
  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/sentiment`);
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "sentiment_update" && d.results?.length) {
        const r = d.results;
        const avg = r.reduce((a: number, x: any) => a + x.score, 0) / r.length;
        setAvgScore(avg);
        setLiveUpdates((p) => [{ label: r[0].label, score: r[0].score }, ...p.slice(0, 9)]);
        const bullishPct = r.filter((x: any) => x.label === "bullish").length / r.length;
        const bearishPct = r.filter((x: any) => x.label === "bearish").length / r.length;
        const neutralPct = 1 - bullishPct - bearishPct;
        setTrend((p) => [...p.slice(-20), {
          time: new Date().toLocaleTimeString(),
          bullish: parseFloat(bullishPct.toFixed(3)),
          neutral: parseFloat(neutralPct.toFixed(3)),
          bearish: parseFloat(bearishPct.toFixed(3)),
        }]);
      }
    };
    return () => ws.close();
  }, []);

  const fetchAndAnalyze = async () => {
    setLoading(true);
    try {
      const res = await api().post<Result[]>("/sentiment/analyze", { query, limit: 20 });
      setResults(res.data);
      const avg = res.data.reduce((a, r) => a + r.score, 0) / (res.data.length || 1);
      setAvgScore(avg);
      // Build trend point
      const bullishPct = res.data.filter((r) => r.label === "bullish").length / res.data.length;
      const bearishPct = res.data.filter((r) => r.label === "bearish").length / res.data.length;
      setTrend((p) => [...p.slice(-20), {
        time: new Date().toLocaleTimeString(),
        bullish: parseFloat(bullishPct.toFixed(3)),
        neutral: parseFloat((1 - bullishPct - bearishPct).toFixed(3)),
        bearish: parseFloat(bearishPct.toFixed(3)),
      }]);
    } catch {}
    setLoading(false);
  };

  const exportData = () => {
    const csv = ["label,score,text", ...results.map((r) => `${r.label},${r.score},"${r.text || ""}"`).join("\n")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `sentiment_${query}_${Date.now()}.csv`; a.click();
  };

  const labelColor = (l: string) =>
    l === "bullish" ? "badge-green" : l === "bearish" ? "badge-red" : "badge-gray";

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Sentiment Analysis Engine</h1>
        <p className="text-gray-400 text-sm mt-0.5">NLP-powered market sentiment from social media</p>
      </div>

      {/* Query bar */}
      <div className="flex gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          className="input flex-1" placeholder="Enter keyword or symbol (e.g. bitcoin, ETH)" />
        <button onClick={fetchAndAnalyze} disabled={loading}
          className="btn btn-blue whitespace-nowrap">
          {loading ? "Analyzing..." : "🔍 Fetch & Analyze"}
        </button>
        <button onClick={exportData} className="btn btn-ghost">📥 Export CSV</button>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SentimentGauge score={avgScore} />
        <SentimentTrendChart data={trend} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Feed */}
        <div className="card border-neonBlue/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-white">Analyzed Feed</div>
            <span className="badge badge-blue">{results.length} items</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="border border-white/5 rounded-lg px-3 py-2 text-xs animate-fade-in">
                <div className="flex justify-between mb-1">
                  <span className={`badge ${labelColor(r.label)}`}>{r.label}</span>
                  <span className="text-gray-500 mono">conf: {(r.score * 100).toFixed(1)}%</span>
                </div>
                <div className="text-gray-300">{r.text ? r.text : `Sample text #${i + 1} for "${query}"`}</div>
              </div>
            ))}
            {!results.length && (
              <div className="text-xs text-gray-500 py-6 text-center">
                Click "Fetch & Analyze" to see sentiment analysis results
              </div>
            )}
          </div>
        </div>

        {/* Live WS updates + controls */}
        <div className="space-y-4">
          <div className="card border-neonBlue/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-white">Live WS Updates</div>
              {liveUpdates.length > 0 && <span className="pulse-dot" />}
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {liveUpdates.map((u, i) => (
                <div key={i} className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className={`badge ${labelColor(u.label)}`}>{u.label}</span>
                  <span className="text-gray-400 mono">{(u.score * 100).toFixed(1)}%</span>
                </div>
              ))}
              {!liveUpdates.length && <div className="text-xs text-gray-500">Streaming live from WebSocket...</div>}
            </div>
          </div>

          {/* Action buttons */}
          <div className="card border-neonBlue/20 p-4 space-y-2">
            <div className="text-sm font-semibold text-white mb-1">Actions</div>
            <button onClick={fetchAndAnalyze} className="btn btn-blue w-full">🐦 Fetch Live Tweets</button>
            <button onClick={fetchAndAnalyze} className="btn btn-green w-full">✅ Analyze Sentiment</button>
            <button className="btn btn-ghost w-full">🧠 Train NLP Model</button>
            <button onClick={exportData} className="btn btn-ghost w-full">📤 Export Sentiment Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import DashboardCards from "@/components/DashboardCards";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const WS_BASE = process.env.NEXT_PUBLIC_WS_BASE || "ws://localhost:8000";

type Ticker = { symbol: string; price: number; change: number };
const TICKERS: Ticker[] = [
  { symbol: "BTC/USDT", price: 67_420.5, change: 2.3 },
  { symbol: "ETH/USDT", price: 3_520.8,  change: -0.8 },
  { symbol: "SOL/USDT", price: 182.4,    change: 4.1 },
  { symbol: "BNB/USDT", price: 580.3,    change: 1.2 },
  { symbol: "AAPL",     price: 189.7,    change: 0.5 },
  { symbol: "TSLA",     price: 248.2,    change: -1.3 },
  { symbol: "MSFT",     price: 414.5,    change: 0.9 },
];

export default function Dashboard() {
  const [portfolioValue, setPortfolioValue] = useState(10_000);
  const [sentiment, setSentiment]           = useState("Neutral");
  const [activeTrades, setActiveTrades]     = useState(0);
  const [fraudAlerts, setFraudAlerts]       = useState(0);
  const [priceHistory, setPriceHistory]     = useState<{ v: number }[]>([]);
  const [tickers, setTickers] = useState(TICKERS);

  useEffect(() => {
    // Market WebSocket
    const wsMarket = new WebSocket(`${WS_BASE}/ws/market`);
    wsMarket.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "market_update") {
        setPortfolioValue(d.portfolio_value ?? portfolioValue);
        setActiveTrades(1);
        setPriceHistory((p) => [...p.slice(-40), { v: d.price }]);
      }
    };

    // Sentiment WebSocket
    const wsSentiment = new WebSocket(`${WS_BASE}/ws/sentiment`);
    wsSentiment.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "sentiment_update" && d.results?.length) {
        const avg = d.results.reduce((a: number, r: any) => a + r.score, 0) / d.results.length;
        setSentiment(avg > 0.6 ? "Bullish" : avg < 0.4 ? "Bearish" : "Neutral");
      }
    };

    // Fraud WebSocket
    const wsFraud = new WebSocket(`${WS_BASE}/ws/fraud`);
    wsFraud.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "fraud_alert") setFraudAlerts((p) => p + 1);
    };

    // Mock ticker animation
    const tickerInterval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => ({
          ...t,
          price: t.price * (1 + (Math.random() - 0.5) * 0.002),
          change: t.change + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 2000);

    return () => {
      wsMarket.close();
      wsSentiment.close();
      wsFraud.close();
      clearInterval(tickerInterval);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">AI-powered real-time market intelligence</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-finGreen">
          <span className="pulse-dot" />
          <span className="font-mono">Live · UTC {new Date().toUTCString().slice(17, 25)}</span>
        </div>
      </div>

      {/* Stats cards */}
      <DashboardCards
        portfolioValue={portfolioValue}
        marketSentiment={sentiment}
        activeTrades={activeTrades}
        fraudAlerts={fraudAlerts}
      />

      {/* Middle row: mini chart + ticker table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mini price sparkline */}
        <div className="card border-neonBlue/20 p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-white">Portfolio Performance</div>
            <span className="badge badge-green">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={priceHistory}>
              <Tooltip
                contentStyle={{ background: "#0a0d1a", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, "Price"]}
              />
              <Line type="monotone" dataKey="v" stroke="#00e5ff" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          {!priceHistory.length && (
            <div className="text-center text-gray-500 text-sm py-4">Start the Trading Bot to see live data</div>
          )}
        </div>

        {/* Module status */}
        <div className="card border-neonBlue/20 p-4">
          <div className="text-sm font-semibold text-white mb-3">Module Status</div>
          <div className="space-y-3">
            {[
              { label: "Trading Bot",     status: activeTrades > 0 ? "Running" : "Idle",    color: activeTrades > 0 ? "text-finGreen" : "text-gray-400" },
              { label: "Sentiment AI",    status: "Ready",  color: "text-neonBlue" },
              { label: "Fraud Detector",  status: "Active", color: "text-neonBlue" },
              { label: "Data Stream",     status: "Live",   color: "text-finGreen"  },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{m.label}</span>
                <span className={`text-xs font-semibold mono ${m.color}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live market ticker */}
      <div className="card border-neonBlue/20 p-4 overflow-hidden">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Live Market Ticker</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {tickers.map((t) => (
            <div key={t.symbol} className="text-center">
              <div className="text-[10px] text-gray-500 mono">{t.symbol}</div>
              <div className="text-sm font-bold text-white mono">${t.price.toFixed(t.price > 1000 ? 0 : 2)}</div>
              <div className={`text-[10px] mono font-semibold ${t.change >= 0 ? "text-finGreen" : "text-danger"}`}>
                {t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <p className="text-gray-500 text-sm">
        Use the sidebar to navigate to the <span className="text-neonBlue">Trading Bot</span>, <span className="text-neonBlue">Sentiment Analysis</span>, and <span className="text-neonBlue">DeFi Fraud</span> modules.
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import PriceChart from "@/components/PriceChart";
import TradeHistoryTable from "@/components/TradeHistoryTable";

type Trade = { id: number; side: string; price: number; qty: number; pnl: number; timestamp: string; symbol: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";
const WS_BASE  = process.env.NEXT_PUBLIC_WS_BASE  || "ws://localhost:8000";

const TOKEN = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
const api = () => axios.create({
  baseURL: API_BASE,
  headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
});

export default function TradingBotPage() {
  const [priceData, setPriceData]   = useState<{ time: string; price: number; ma20?: number }[]>([]);
  const [trades, setTrades]         = useState<Trade[]>([]);
  const [signal, setSignal]         = useState("—");
  const [price, setPrice]           = useState(0);
  const [pnl, setPnl]               = useState(0);
  const [portfolio, setPortfolio]   = useState(10_000);
  const [rsi, setRsi]               = useState(0);
  const [macd, setMacd]             = useState(0);
  const [macdSig, setMacdSig]       = useState(0);
  const [running, setRunning]       = useState(false);
  const [stocks, setStocks]         = useState<Record<string, number>>({});
  const [tickerInput, setTickerInput] = useState("AAPL,MSFT,TSLA");
  const [backtestResult, setBacktestResult] = useState<any>(null);
  const [btLoading, setBtLoading]   = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/market`);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "market_update") {
        setPrice(msg.price);
        setSignal(msg.signal);
        setPortfolio(msg.portfolio_value);
        setPnl(msg.profit_loss);
        setRsi(msg.rsi ?? 0);
        setMacd(msg.macd ?? 0);
        setMacdSig(msg.macd_signal ?? 0);
        if (msg.trade_history) setTrades(msg.trade_history);
        setPriceData((prev) => [
          ...prev.slice(-150),
          { time: new Date().toLocaleTimeString(), price: msg.price, ma20: msg.ma_20 },
        ]);
      }
      if (msg.type === "stock_update") {
        setStocks((prev) => ({ ...prev, [msg.symbol]: msg.price }));
      }
    };
    return () => ws.close();
  }, []);

  const startBot = async () => {
    try { await api().post("/trade/start", { symbol: "BTCUSDT" }); setRunning(true); }
    catch { setRunning(true); } // demo: just set state
  };
  const stopBot = async () => {
    try { await api().post("/trade/stop"); } catch {}
    setRunning(false);
  };
  const runBacktest = async () => {
    setBtLoading(true);
    try {
      const r = await api().post("/trade/backtest");
      setBacktestResult(r.data);
    } catch { setBacktestResult({ status: "error" }); }
    setBtLoading(false);
  };
  const startStocks = async () => {
    const tickers = tickerInput.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean);
    try { await api().post("/trade/stocks/start", { tickers }); } catch {}
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Real-Time Algorithmic Trading Bot</h1>
          <p className="text-gray-400 text-sm mt-0.5">Technical Indicators × AI Sentiment Fusion</p>
        </div>
        <div className={`flex items-center gap-2 text-xs ${running ? "text-finGreen" : "text-gray-500"}`}>
          <span className={running ? "pulse-dot" : "w-2 h-2 rounded-full bg-gray-600 inline-block"} />
          {running ? "BOT RUNNING" : "BOT IDLE"}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Chart column */}
        <div className="xl:col-span-2 space-y-4">
          <PriceChart data={priceData} rsi={rsi} macd={macd} macdSignal={macdSig} />
          <TradeHistoryTable trades={trades} />
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Live stats */}
          <div className="card border-neonBlue/20 p-4 space-y-3">
            <div className="text-sm font-semibold text-white">Live Stats</div>
            {[
              { label: "Market Price",   val: `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, color: "text-white" },
              { label: "Signal",         val: signal, color: signal === "BUY" ? "text-finGreen" : signal === "SELL" ? "text-danger" : "text-neonBlue" },
              { label: "Portfolio",      val: `$${portfolio.toFixed(2)}`, color: "text-finGreen" },
              { label: "P/L",            val: `${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)}`, color: pnl >= 0 ? "text-finGreen" : "text-danger" },
              { label: "RSI (14)",       val: rsi.toFixed(1), color: rsi > 70 ? "text-danger" : rsi < 30 ? "text-finGreen" : "text-gray-300" },
              { label: "MACD",          val: macd.toFixed(4), color: macd > 0 ? "text-finGreen" : "text-danger" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className={`text-sm font-bold mono ${item.color}`}>{item.val}</span>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="card border-neonBlue/20 p-4 space-y-2">
            <div className="text-sm font-semibold text-white mb-1">Bot Controls</div>
            <button onClick={startBot} disabled={running}
              className="btn btn-green w-full">▶ Start Trading Bot</button>
            <button onClick={stopBot} disabled={!running}
              className="btn btn-red w-full">■ Stop Trading Bot</button>
            <button onClick={runBacktest} disabled={btLoading}
              className="btn btn-blue w-full">{btLoading ? "Running..." : "⚡ Run Backtest"}</button>
            <button className="btn btn-ghost w-full">📂 Load Strategy</button>
            <button className="btn btn-ghost w-full">🔗 Connect Exchange API</button>
            <button className="btn btn-ghost w-full">📥 Download Report</button>
          </div>

          {/* Backtest result */}
          {backtestResult && (
            <div className="card border-neonBlue/20 p-4 text-xs space-y-1.5">
              <div className="text-sm font-semibold text-white mb-2">Backtest Results</div>
              {backtestResult.status === "error" ? (
                <div className="text-danger">Backtest failed — check server logs</div>
              ) : (
                <>
                  <div className="flex justify-between"><span className="text-gray-400">Return</span><span className={backtestResult.total_return_pct >= 0 ? "text-finGreen mono" : "text-danger mono"}>{backtestResult.total_return_pct}%</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Final NAV</span><span className="text-white mono">${backtestResult.final_portfolio?.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Sharpe</span><span className="text-neonBlue mono">{backtestResult.sharpe_ratio}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Max DD</span><span className="text-danger mono">{backtestResult.max_drawdown_pct}%</span></div>
                </>
              )}
            </div>
          )}

          {/* Stocks streamer */}
          <div className="card border-neonBlue/20 p-4">
            <div className="text-sm font-semibold text-white mb-2">Stock Feed</div>
            <div className="flex gap-2 mb-3">
              <input value={tickerInput} onChange={(e) => setTickerInput(e.target.value)}
                className="input flex-1" placeholder="AAPL,MSFT,TSLA" />
              <button onClick={startStocks} className="btn btn-blue px-3">▶</button>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {Object.entries(stocks).map(([sym, p]) => (
                <div key={sym} className="flex justify-between px-2 py-1.5 rounded border border-white/5 text-xs">
                  <span className="font-semibold text-neonBlue mono">{sym}</span>
                  <span className="text-white mono">${p.toFixed(2)}</span>
                </div>
              ))}
              {!Object.keys(stocks).length && (
                <div className="text-xs text-gray-500">No feed active.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

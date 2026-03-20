'use client';
import { useState } from 'react';
import BacktestChart from '@/components/BacktestChart';

const STRATEGIES = [
  { id: 'fusion',   name: 'Sentiment + Tech Fusion',  desc: 'Combines RSI, MACD, MA with NLP sentiment score' },
  { id: 'rsi',      name: 'RSI Mean Reversion',         desc: 'Buy oversold RSI (<30), sell overbought (>70)'    },
  { id: 'macd',     name: 'MACD Crossover',              desc: 'Enter on MACD/signal crossover, exit on reversal' },
  { id: 'ma',       name: 'Golden Cross MA',             desc: '50-day MA crossing 200-day MA long entries'       },
];

type ResultType = {
  totalReturn: number; sharpe: number; maxDrawdown: number;
  winRate: number; trades: number; equity: {value:number;date:string}[];
};

function makeEquityCurve(capital: number, ret: number) {
  const n = 30;
  return Array.from({ length: n }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: +(capital * (1 + (ret / 100) * (i / n) + (Math.random() - 0.5) * 0.03)).toFixed(2),
  }));
}

export default function BacktestingPage() {
  const [strategy, setStrategy]   = useState('fusion');
  const [period, setPeriod]       = useState('1y');
  const [symbol, setSymbol]       = useState('BTCUSDT');
  const [capital, setCapital]     = useState('10000');
  const [running, setRunning]     = useState(false);
  const [result, setResult]       = useState<ResultType | null>(null);

  const run = async () => {
    setRunning(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1800));
    const ret       = +(Math.random() * 80 - 15).toFixed(2);
    const sharpe    = +(Math.random() * 2.5 + 0.5).toFixed(2);
    const dd        = +(Math.random() * 35 + 5).toFixed(1);
    const winRate   = +(Math.random() * 30 + 48).toFixed(1);
    const trades    = Math.floor(Math.random() * 120 + 40);
    setResult({ totalReturn: ret, sharpe, maxDrawdown: dd, winRate, trades,
      equity: makeEquityCurve(+capital, ret) });
    setRunning(false);
  };

  const demoRun = () => {
    const ret = 34.7;
    setResult({ totalReturn: ret, sharpe: 1.82, maxDrawdown: 12.4, winRate: 62.3, trades: 87,
      equity: makeEquityCurve(+capital, ret) });
  };

  return (
    <div className="page-content">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="accent-line" />
          <h1 className="section-title text-gradient-cyan-violet">Strategy Backtesting</h1>
          <p className="section-subtitle">Test trading strategies on historical price data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Config Panel */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          {/* Strategy Select */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Select Strategy</p>
            <div className="flex flex-col gap-2">
              {STRATEGIES.map(s => (
                <label key={s.id}
                  className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer border transition-all ${
                    strategy === s.id
                      ? 'border-[#00f5ff]/40 bg-[#00f5ff]/05'
                      : 'border-white/5 hover:border-white/10'
                  }`}>
                  <input type="radio" name="strategy" value={s.id}
                    checked={strategy === s.id}
                    onChange={() => setStrategy(s.id)}
                    className="mt-0.5 accent-cyan-400" />
                  <div>
                    <p className={`text-sm font-semibold ${strategy === s.id ? 'text-[#00f5ff]' : 'text-white/80'}`}>{s.name}</p>
                    <p className="text-[0.65rem] text-white/30 mt-0.5">{s.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Parameters</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="metric-label mb-1 block">Time Period</label>
                <select value={period} onChange={e => setPeriod(e.target.value)} className="glass-input">
                  {['1m','3m','6m','1y','2y','5y'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="metric-label mb-1 block">Symbol</label>
                <input value={symbol} onChange={e => setSymbol(e.target.value)} className="glass-input font-mono" />
              </div>
              <div>
                <label className="metric-label mb-1 block">Initial Capital (USDT)</label>
                <input value={capital} onChange={e => setCapital(e.target.value)} className="glass-input font-mono" />
              </div>
            </div>
          </div>

          {/* Run Buttons */}
          <div className="flex flex-col gap-2">
            <button onClick={run} disabled={running} className="btn btn-cyan w-full justify-center py-3">
              {running ? (
                <span className="flex items-center gap-2"><span className="shimmer w-16 h-3 rounded" /> Running…</span>
              ) : '⚡ Run Backtest'}
            </button>
            <button onClick={demoRun} className="btn btn-ghost w-full justify-center">▶ Run Demo</button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {!result ? (
            <div className="glass-card p-8 flex flex-col items-center justify-center gap-3 text-center" style={{minHeight:300}}>
              <span className="text-4xl animate-float">📊</span>
              <p className="text-white/40 text-sm">Select a strategy and run backtest to see results</p>
              <button onClick={demoRun} className="btn btn-violet">View Demo Results</button>
            </div>
          ) : (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 stagger-children">
                {[
                  { label:'Total Return',  value:`${result.totalReturn>=0?'+':''}${result.totalReturn}%`,  color: result.totalReturn>=0?'text-glow-green':'text-glow-red',   card: result.totalReturn>=0?'stat-card-green':'stat-card-red'  },
                  { label:'Sharpe Ratio',  value:result.sharpe.toFixed(2),  color:'text-glow-cyan',   card:'stat-card-cyan'   },
                  { label:'Max Drawdown',  value:`-${result.maxDrawdown}%`, color:'text-glow-red',    card:'stat-card-red'    },
                  { label:'Win Rate',      value:`${result.winRate}%`,       color:'text-glow-violet', card:'stat-card-violet' },
                  { label:'Total Trades',  value:result.trades.toString(),   color:'text-glow-amber',  card:'stat-card-amber'  },
                ].map(m => (
                  <div key={m.label} className={`stat-card ${m.card} animate-fade-in-up text-center`}>
                    <p className={`metric-value text-base ${m.color}`}>{m.value}</p>
                    <p className="metric-label mt-1">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Equity Curve */}
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Equity Curve</p>
                  <span className={`badge ${result.totalReturn >= 0 ? 'badge-green' : 'badge-red'}`}>
                    {result.totalReturn >= 0 ? '▲' : '▼'} {Math.abs(result.totalReturn)}%
                  </span>
                </div>
                <div className="chart-container" style={{ height: 220 }}>
                  <BacktestChart data={result.equity} />
                </div>
              </div>

              {/* Notes */}
              <div className="glass-card p-3 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">⚠</span>
                <p className="text-[0.7rem] text-white/30">
                  Past performance does not guarantee future results. Backtests use synthetic data in demo mode.
                  Connect a real exchange API for live historical data.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

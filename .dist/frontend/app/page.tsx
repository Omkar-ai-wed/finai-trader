'use client';
import { useEffect, useState } from 'react';

const TICKERS = [
  { symbol: 'BTC/USDT', base: 67420 },
  { symbol: 'ETH/USDT', base: 3510  },
  { symbol: 'SOL/USDT', base: 182   },
  { symbol: 'BNB/USDT', base: 428   },
  { symbol: 'ARB/USDT', base: 1.82  },
  { symbol: 'AVAX/USD', base: 38.5  },
];

type Ticker = { price: number; change: number };

const STAT_CARDS = [
  { key: 'portfolio', label: 'Total Portfolio',  suffix: '',  icon: '💰', color: 'stat-card-cyan',   textColor: 'text-glow-cyan'   },
  { key: 'sentiment', label: 'Market Sentiment', suffix: '',  icon: '🧠', color: 'stat-card-violet', textColor: 'text-glow-violet' },
  { key: 'trades',    label: 'Active Trades',    suffix: '',  icon: '📊', color: 'stat-card-green',  textColor: 'text-glow-green'  },
  { key: 'alerts',    label: 'Fraud Alerts',     suffix: '',  icon: '🚨', color: 'stat-card-red',    textColor: 'text-glow-red'    },
];

const MODULES = [
  { name: 'Trading Bot',    status: 'Idle',   dot: 'bg-[#fbbf24]' },
  { name: 'Sentiment AI',   status: 'Ready',  dot: 'bg-[#10ffd1]' },
  { name: 'Fraud Detector', status: 'Active', dot: 'bg-[#10ffd1] animate-pulse-dot' },
];

export default function DashboardPage() {
  const [tickers, setTickers] = useState<Record<string, Ticker>>(
    Object.fromEntries(TICKERS.map(t => [t.symbol, { price: t.base, change: 0 }]))
  );
  const [portfolio, setPortfolio] = useState(10000);
  const [sparkline, setSparkline] = useState<number[]>(Array(20).fill(10000));
  const [clock, setClock] = useState('');

  useEffect(() => {
    // Update clock client-side only to avoid hydration mismatch
    const updateClock = () => setClock(new Date().toISOString().slice(11, 19));
    updateClock();
    const clockIv = setInterval(updateClock, 1000);
    return () => clearInterval(clockIv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setTickers(prev => {
        const next = { ...prev };
        TICKERS.forEach(t => {
          const drift = t.base * (Math.random() * 0.003 - 0.0015);
          const price = +(prev[t.symbol].price + drift).toFixed(t.base > 1000 ? 2 : 4);
          const change = +((price - t.base) / t.base * 100).toFixed(2);
          next[t.symbol] = { price, change };
        });
        return next;
      });
      setPortfolio(p => {
        const next = +(p + (Math.random() * 40 - 18)).toFixed(2);
        setSparkline(s => [...s.slice(1), next]);
        return next;
      });
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  // mini sparkline path
  const spark = (() => {
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const w = 120, h = 36;
    const pts = sparkline.map((v, i) => `${(i / (sparkline.length - 1)) * w},${h - ((v - min) / range) * h}`);
    return `M${pts.join('L')}`;
  })();

  const portfolioChange = +((portfolio - 10000) / 10000 * 100).toFixed(2);
  const isUp = portfolioChange >= 0;

  return (
    <div className="page-content">
      {/* ── Header ───────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="accent-line" />
          <h1 className="section-title text-gradient-cyan-violet">Trading Dashboard</h1>
          <p className="section-subtitle">AI-powered real-time market intelligence</p>
        </div>
        <div className="glass-card px-3 py-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10ffd1] animate-pulse-dot" />
          <span className="font-mono text-[0.65rem] text-[#10ffd1]/80 uppercase tracking-widest" suppressHydrationWarning>
            {clock ? `Live · UTC ${clock}` : 'Live Market Data'}
          </span>
        </div>
      </div>

      {/* ── Live Ticker Tape ─────────────────────── */}
      <div className="ticker-wrap rounded-xl overflow-hidden">
        <div className="ticker-track">
          {[...TICKERS, ...TICKERS].map((t, i) => {
            const data = tickers[t.symbol];
            const up = data.change >= 0;
            return (
              <div key={i} className="ticker-item">
                <span className="text-white/50">{t.symbol}</span>
                <span className="font-semibold text-white">
                  ${data.price.toLocaleString()}
                </span>
                <span className={up ? 'text-[#10ffd1]' : 'text-[#ff3d6e]'}>
                  {up ? '▲' : '▼'} {Math.abs(data.change)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 stagger-children">
        {STAT_CARDS.map(c => (
          <div key={c.key} className={`stat-card ${c.color} animate-fade-in-up`}>
            <div className="flex justify-between items-start">
              <p className="metric-label">{c.label}</p>
              <span className="text-xl">{c.icon}</span>
            </div>
            <p className={`metric-value mt-2 ${c.textColor}`}>
              {c.key === 'portfolio' ? `$${portfolio.toLocaleString()}` :
               c.key === 'sentiment' ? 'Neutral' :
               c.key === 'trades'    ? '0' : '0'}
            </p>
            <p className="text-[0.65rem] text-white/25 mt-1">
              {c.key === 'portfolio' ? `${isUp ? '+' : ''}${portfolioChange}% today` :
               c.key === 'sentiment' ? 'NLP Analysis' :
               c.key === 'trades'    ? 'Open Positions' : 'DeFi Detections'}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bottom Row ───────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        {/* Portfolio Sparkline */}
        <div className="glass-card p-4 lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Portfolio Performance</p>
              <p className="font-mono text-lg font-bold text-white mt-0.5">${portfolio.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="badge badge-live">Live</span>
              <span className={`badge ${isUp ? 'badge-green' : 'badge-red'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(portfolioChange)}%
              </span>
            </div>
          </div>
          <div className="chart-container h-24">
            <svg width="100%" height="100%" viewBox="0 0 120 36" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? '#10ffd1' : '#ff3d6e'} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={isUp ? '#10ffd1' : '#ff3d6e'} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={spark + `L120,36L0,36Z`}
                fill="url(#sparkGrad)"
              />
              <path
                d={spark}
                fill="none"
                stroke={isUp ? '#10ffd1' : '#ff3d6e'}
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 4px ${isUp ? '#10ffd1' : '#ff3d6e'})` }}
              />
            </svg>
            <p className="absolute inset-x-0 bottom-1 text-center text-[0.6rem] text-white/20">
              Connect trading bot to see live data
            </p>
          </div>
        </div>

        {/* Module Status */}
        <div className="glass-card p-4 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">AI Module Status</p>
          <div className="flex flex-col gap-2">
            {MODULES.map(m => (
              <div key={m.name} className="alert-item">
                <span className={`alert-dot ${m.dot} mt-1`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white/90">{m.name}</p>
                  <p className="text-[0.7rem] text-white/35">{m.status}</p>
                </div>
                <span className={`badge ${m.status === 'Active' ? 'badge-green' : m.status === 'Idle' ? 'badge-amber' : 'badge-cyan'}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <hr className="glass-divider my-3" />
          <div className="grid grid-cols-3 gap-2 text-center">
            {[['Signals', '0'], ['Alerts', '0'], ['Uptime', '99.9%']].map(([k,v]) => (
              <div key={k}>
                <p className="font-mono text-sm font-bold text-white">{v}</p>
                <p className="text-[0.6rem] text-white/25 uppercase tracking-wider">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Market Grid ──────────────────────────── */}
      <div className="glass-card p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Live Market Grid</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {TICKERS.map(t => {
            const d = tickers[t.symbol];
            const up = d.change >= 0;
            return (
              <div
                key={t.symbol}
                className="rounded-xl p-3 text-center transition-all cursor-default hover:scale-[1.03]"
                style={{
                  background: up ? 'rgba(16,255,209,0.06)' : 'rgba(255,61,110,0.06)',
                  border: `1px solid ${up ? 'rgba(16,255,209,0.15)' : 'rgba(255,61,110,0.15)'}`,
                }}
              >
                <p className="text-[0.65rem] text-white/40 font-mono uppercase">{t.symbol}</p>
                <p className="font-mono font-bold text-sm text-white mt-0.5">
                  ${d.price.toLocaleString()}
                </p>
                <p className={`text-[0.65rem] font-bold mt-0.5 ${up ? 'text-[#10ffd1]' : 'text-[#ff3d6e]'}`}>
                  {up ? '▲' : '▼'} {Math.abs(d.change)}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect, useRef }  from 'react';
import SentimentGauge from '@/components/SentimentGauge';
import SentimentTrendChart from '@/components/SentimentTrendChart';

type Feed = { text: string; label: string; score: number; source: string; ts: string };

const MOCK_TEXTS = [
  { text: 'Bitcoin breaking ATH — huge institutional inflow detected!', label: 'bullish',   score: 0.91 },
  { text: 'Crypto regulation fears spark sell-off across altcoins.',    label: 'bearish',   score: 0.78 },
  { text: 'ETH staking rewards remain stable at 4.2% APY.',            label: 'neutral',   score: 0.65 },
  { text: 'Whale wallets accumulating BTC at current levels.',          label: 'bullish',   score: 0.84 },
  { text: 'Market fear index spikes — caution advised.',                label: 'bearish',   score: 0.72 },
];

export default function SentimentPage() {
  const [query, setQuery] = useState('bitcoin');
  const [score, setScore] = useState(0.5);
  const [feed, setFeed] = useState<Feed[]>([]);
  const [trend, setTrend] = useState<{t:string;bull:number;bear:number;neutral:number}[]>([]);
  const wsRef = useRef<WebSocket|null>(null);

  // seed trend
  useEffect(()=>{
    const now = Date.now();
    setTrend(Array.from({length:10},(_,i)=>({
      t: new Date(now-i*60000).toLocaleTimeString(),
      bull: +(40+Math.random()*30).toFixed(0),
      bear: +(10+Math.random()*25).toFixed(0),
      neutral: +(20+Math.random()*20).toFixed(0),
    })).reverse());
    // mock WS
    const iv = setInterval(()=>{
      const m = MOCK_TEXTS[Math.floor(Math.random()*MOCK_TEXTS.length)];
      const item:Feed = {...m, source:['Twitter','Reddit','News'][Math.floor(Math.random()*3)], ts:new Date().toLocaleTimeString()};
      setFeed(f=>[item,...f.slice(0,19)]);
      setScore(s=>+Math.max(0.05,Math.min(0.95,s+(Math.random()*0.08-0.04))).toFixed(3));
      setTrend(t=>[...t.slice(1),{
        t:new Date().toLocaleTimeString(),
        bull:+(40+Math.random()*30).toFixed(0),
        bear:+(10+Math.random()*25).toFixed(0),
        neutral:+(20+Math.random()*20).toFixed(0),
      }]);
    },3000);
    return()=>clearInterval(iv);
  },[]);

  const labelColor = (l:string) => l==='bullish'?'badge-green':l==='bearish'?'badge-red':'badge-amber';

  return (
    <div className="page-content">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="accent-line" />
          <h1 className="section-title text-gradient-cyan-violet">Sentiment Analysis Engine</h1>
          <p className="section-subtitle">NLP-powered market sentiment from social media</p>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="flex gap-2 items-center">
          <input value={query} onChange={e=>setQuery(e.target.value)}
            className="glass-input" placeholder="Enter query (e.g. bitcoin, ethereum…)" />
          <button className="btn btn-cyan shrink-0">🔍 Analyze</button>
          <button className="btn btn-ghost shrink-0">📥 Export CSV</button>
        </div>
      </div>

      {/* Gauge + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Sentiment Gauge</p>
            <span className="badge badge-live">Live</span>
          </div>
          <SentimentGauge score={score} />
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Sentiment Trend</p>
          <div className="chart-container" style={{height:180}}>
            <SentimentTrendChart data={trend} />
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Live Feed <span className="ml-1.5 text-white/20">{feed.length} items</span>
          </p>
          <div className="flex gap-1.5">
            {['Fetch Live Tweets','Analyze Sentiment','Train NLP Model'].map(b=>(
              <button key={b} className="btn btn-ghost text-[0.7rem] px-2 py-1">{b}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
          {feed.length===0 ? (
            <p className="text-sm text-white/25 text-center py-8">Waiting for live sentiment data…</p>
          ) : feed.map((f,i)=>(
            <div key={i} className="alert-item gap-3">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <p className="text-sm text-white/80 truncate">{f.text}</p>
                <p className="text-[0.65rem] text-white/30 font-mono">{f.source} · {f.ts} · Score: {f.score.toFixed(2)}</p>
              </div>
              <span className={`badge ${labelColor(f.label)} shrink-0`}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

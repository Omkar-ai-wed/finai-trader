'use client';
import { useState, useEffect } from 'react';
import PriceChart from '@/components/PriceChart';
import TradeHistoryTable from '@/components/TradeHistoryTable';

export default function TradingBotPage() {
  const [running, setRunning] = useState(false);
  const [signal, setSignal] = useState('IDLE');
  const [rsi, setRsi] = useState(50.0);
  const [macd, setMacd] = useState(0.0);
  const [ma20, setMa20] = useState(0.0);
  const [price, setPrice] = useState(67420);
  const [pnl, setPnl] = useState(0);
  const [priceHistory, setPriceHistory] = useState<{time:string;price:number;ma20:number;rsi:number;macd:number}[]>([]);
  const [sticker, setSticker] = useState<{symbol:string;price:number;change:number}[]>([
    {symbol:'AAPL',price:182.3, change:0.4},
    {symbol:'MSFT',price:415.2,change:-0.2},
    {symbol:'TSLA',price:247.8,change:1.1},
  ]);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setPrice(p => {
        const np = +(p * (1 + (Math.random()*0.006-0.003))).toFixed(2);
        setRsi(+(30+Math.random()*40).toFixed(1));
        setMacd(+(Math.random()*200-100).toFixed(2));
        setMa20(+(np*(0.995+Math.random()*0.01)).toFixed(2));
        setPnl(x => +(x+(Math.random()*50-22)).toFixed(2));
        setSignal(['BUY','SELL','HOLD'][Math.floor(Math.random()*3)]);
        const now = new Date().toLocaleTimeString();
        setPriceHistory(h => [...h.slice(-49), {
          time:now, price:np,
          ma20:+(np*(0.997+Math.random()*0.006)).toFixed(2),
          rsi:+(30+Math.random()*40).toFixed(1),
          macd:+(Math.random()*200-100).toFixed(2)
        }]);
        return np;
      });
      setSticker(s => s.map(x=>({...x,price:+(x.price*(1+(Math.random()*0.004-0.002))).toFixed(2),change:+(Math.random()*4-2).toFixed(2)})));
    }, 1000);
    return ()=>clearInterval(iv);
  }, [running]);

  const signalColor = signal==='BUY'?'badge-green':signal==='SELL'?'badge-red':'badge-amber';

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="accent-line" />
          <h1 className="section-title text-gradient-cyan-violet">Algorithmic Trading Bot</h1>
          <p className="section-subtitle">Technical indicators + AI sentiment-fusion signals</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button onClick={()=>setRunning(true)}  disabled={running}  className="btn btn-green">▶ Start Bot</button>
          <button onClick={()=>{setRunning(false);setSignal('IDLE')}} disabled={!running} className="btn btn-red">■ Stop</button>
          <button className="btn btn-violet">⚡ Backtest</button>
        </div>
      </div>

      {/* Live Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
        {[
          {label:'BTC/USDT Price', value:`$${price.toLocaleString()}`, sub:'Current', color:'text-glow-cyan',   card:'stat-card-cyan'  },
          {label:'Signal',         value:signal,                        sub:'AI + Tech', color:signal==='BUY'?'text-glow-green':signal==='SELL'?'text-glow-red':'text-glow-amber', card:'stat-card-amber'},
          {label:'RSI (14)',        value:rsi.toFixed(1),               sub:rsi<30?'Oversold':rsi>70?'Overbought':'Neutral', color:'text-glow-violet', card:'stat-card-violet'},
          {label:'P&L Today',      value:`${pnl>=0?'+':''}$${pnl.toFixed(2)}`, sub:'USDT', color:pnl>=0?'text-glow-green':'text-glow-red', card:pnl>=0?'stat-card-green':'stat-card-red'},
        ].map(c=>(
          <div key={c.label} className={`stat-card ${c.card} animate-fade-in-up`}>
            <p className="metric-label">{c.label}</p>
            <p className={`metric-value mt-2 ${c.color}`}>{c.value}</p>
            <p className="text-[0.65rem] text-white/25 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Indicators */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <p className="text-sm font-semibold text-white/80">BTC/USDT Live Chart</p>
            {running && <span className="badge badge-live">Live</span>}
          </div>
          <div className="flex gap-2 text-xs font-mono text-white/30">
            <span>MACD <span className={macd>=0?'text-[#10ffd1]':'text-[#ff3d6e]'}>{macd.toFixed(2)}</span></span>
            <span>MA20 <span className="text-[#a855f7]">${ma20.toLocaleString()}</span></span>
          </div>
        </div>
        <div className="chart-container" style={{height:260}}>
          <PriceChart data={priceHistory} />
        </div>
      </div>

      {/* Trade History + Stocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="glass-card p-4 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Trade History</p>
          <TradeHistoryTable />
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Stock Feed</p>
          <div className="flex flex-col gap-2">
            {sticker.map(s=>(
              <div key={s.symbol} className="alert-item justify-between">
                <div>
                  <p className="text-sm font-mono font-bold text-white">{s.symbol}</p>
                  <p className="text-xs font-mono text-white/40">${s.price}</p>
                </div>
                <span className={`badge ${s.change>=0?'badge-green':'badge-red'}`}>
                  {s.change>=0?'▲':'▼'} {Math.abs(s.change).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
          <hr className="glass-divider my-3"/>
          <div className="flex items-center gap-2">
            <input className="glass-input text-xs" placeholder="Add ticker (AAPL, MSFT…)" />
            <button className="btn btn-cyan shrink-0">▶</button>
          </div>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="flex flex-wrap gap-2">
        {['Load Strategy','Connect Exchange API','Download Report','Export Trades'].map(b=>(
          <button key={b} className="btn btn-ghost">{b}</button>
        ))}
      </div>
    </div>
  );
}

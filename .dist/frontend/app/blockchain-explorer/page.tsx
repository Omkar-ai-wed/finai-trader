'use client';
import { useState, useEffect } from 'react';

const BLOCKS = [
  { height: 834_213, hash: '0000…f23a', txns: 3142, miner: 'AntPool',   reward: '6.25 BTC', time: '1m ago'  },
  { height: 834_212, hash: '0000…94ab', txns: 2987, miner: 'F2Pool',    reward: '6.25 BTC', time: '11m ago' },
  { height: 834_211, hash: '0000…ee12', txns: 3289, miner: 'Binance',   reward: '6.25 BTC', time: '21m ago' },
  { height: 834_210, hash: '0000…78cd', txns: 2846, miner: 'Foundry',   reward: '6.25 BTC', time: '31m ago' },
  { height: 834_209, hash: '0000…c9f1', txns: 3071, miner: 'SlushPool', reward: '6.25 BTC', time: '42m ago' },
];

const TXNS = [
  { hash: '0xabf9…32e1', from: '0xABC…123', to: '0xDEF…456', value: '1.2340 BTC', gas: '21,000', age: '2m',  status: 'success' },
  { hash: '0x9912…aa21', from: '0xGHI…789', to: '0xJKL…012', value: '0.0120 BTC', gas: '21,000', age: '5m',  status: 'success' },
  { hash: '0xcc44…b891', from: '0xMNO…345', to: '0xPQR…678', value: '5.6000 BTC', gas: '45,000', age: '12m', status: 'pending' },
  { hash: '0xff12…3344', from: '0xSTU…901', to: '0xVWX…234', value: '0.0012 BTC', gas: '21,000', age: '18m', status: 'success' },
  { hash: '0x3312…aabc', from: '0xYZA…567', to: '0xBCD…890', value: '12.00 BTC',  gas: '63,000', age: '24m', status: 'failed'  },
  { hash: '0x7f91…cc22', from: '0xEFG…111', to: '0xHIJ…222', value: '0.3310 BTC', gas: '28,000', age: '31m', status: 'success' },
];

const STAT_DEFS = [
  { label: 'Block Height',   value: '834,213',     icon: '⬡', color: 'stat-card-cyan',   text: 'text-glow-cyan'   },
  { label: 'Avg Block Time', value: '9m 48s',       icon: '⏱', color: 'stat-card-violet', text: 'text-glow-violet' },
  { label: 'Hash Rate',      value: '624 EH/s',     icon: '⚡', color: 'stat-card-green',  text: 'text-glow-green'  },
  { label: 'Mempool',        value: '41,234 txns',  icon: '📦', color: 'stat-card-amber',  text: 'text-glow-amber'  },
  { label: 'BTC Price',      value: '$67,420',       icon: '₿', color: 'stat-card-cyan',   text: 'text-glow-cyan'   },
  { label: 'Network Fees',   value: '32 sat/vB',    icon: '💸', color: 'stat-card-red',    text: 'text-glow-red'    },
];

export default function BlockchainExplorerPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab]       = useState<'blocks'|'txns'>('blocks');
  const [blockHeight, setBlockHeight] = useState(834_213);

  useEffect(() => {
    const iv = setInterval(() => setBlockHeight(h => h + 1), 12000);
    return () => clearInterval(iv);
  }, []);

  const statusBadge = (s: string) =>
    s === 'success' ? 'badge-green' : s === 'pending' ? 'badge-amber' : 'badge-red';

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="accent-line" />
          <h1 className="section-title text-gradient-cyan-violet">Blockchain Explorer</h1>
          <p className="section-subtitle">Inspect blocks, transactions, and wallet activity in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-live">Live</span>
          <span className="font-mono text-xs text-white/30">Block #{blockHeight.toLocaleString()}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-3">
        <div className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="glass-input font-mono text-sm"
            placeholder="Search by hash, block height, or wallet address…" />
          <button className="btn btn-cyan shrink-0">🔍 Search</button>
          <button className="btn btn-ghost shrink-0">📋 Copy</button>
        </div>
      </div>

      {/* Network Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 stagger-children">
        {STAT_DEFS.map(s => (
          <div key={s.label} className={`stat-card ${s.color} animate-fade-in-up text-center`}>
            <p className="text-xl mb-1">{s.icon}</p>
            <p className={`font-mono font-bold text-sm ${s.text}`}>{s.label === 'Block Height' ? blockHeight.toLocaleString() : s.value}</p>
            <p className="metric-label mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Table */}
      <div className="glass-card overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-white/[0.06] px-1 pt-1">
          {(['blocks','txns'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all border-b-2 mr-1 ${
                tab === t
                  ? 'border-[#00f5ff] text-[#00f5ff]'
                  : 'border-transparent text-white/30 hover:text-white/60'
              }`}>
              {t === 'blocks' ? '⬡ Latest Blocks' : '📄 Transactions'}
            </button>
          ))}
          <div className="ml-auto flex items-center px-3 pb-1">
            <span className="text-[0.65rem] text-white/20 font-mono uppercase tracking-widest">
              {tab === 'blocks' ? `${BLOCKS.length} blocks` : `${TXNS.length} txns`}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {tab === 'blocks' ? (
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Height</th><th>Hash</th><th>Txns</th><th>Miner</th><th>Reward</th><th>Time</th>
                </tr>
              </thead>
              <tbody>
                {BLOCKS.map(b => (
                  <tr key={b.height}>
                    <td><span className="font-mono text-[#00f5ff] font-bold text-xs">{b.height.toLocaleString()}</span></td>
                    <td><span className="font-mono text-white/40 text-xs">{b.hash}</span></td>
                    <td><span className="font-mono text-white/70">{b.txns.toLocaleString()}</span></td>
                    <td><span className="badge badge-violet">{b.miner}</span></td>
                    <td><span className="font-mono text-[#10ffd1] font-semibold">{b.reward}</span></td>
                    <td><span className="text-white/30 text-xs">{b.time}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Hash</th><th>From</th><th>To</th><th>Value</th><th>Gas</th><th>Age</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {TXNS.map(t => (
                  <tr key={t.hash}>
                    <td><span className="font-mono text-[#00f5ff] text-xs">{t.hash}</span></td>
                    <td><span className="font-mono text-white/40 text-xs">{t.from}</span></td>
                    <td><span className="font-mono text-white/40 text-xs">{t.to}</span></td>
                    <td><span className="font-mono text-white font-semibold">{t.value}</span></td>
                    <td><span className="font-mono text-white/50 text-xs">{t.gas}</span></td>
                    <td><span className="text-white/30 text-xs">{t.age}</span></td>
                    <td><span className={`badge ${statusBadge(t.status)}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

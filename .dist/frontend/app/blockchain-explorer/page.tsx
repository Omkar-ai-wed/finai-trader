"use client";

import { useState } from "react";

const SAMPLE_TXN = [
  { hash: "0xabf9...32e1", from: "0xABC...123", to: "0xDEF...456", value: "1.2340 BTC", age: "2m ago",  gas: "21000", status: "success" },
  { hash: "0x9912...aa21", from: "0xGHI...789", to: "0xJKL...012", value: "0.0120 BTC", age: "5m ago",  gas: "21000", status: "success" },
  { hash: "0xcc44...b891", from: "0xMNO...345", to: "0xPQR...678", value: "5.6000 BTC", age: "12m ago", gas: "45000", status: "pending" },
  { hash: "0xff12...3344", from: "0xSTU...901", to: "0xVWX...234", value: "0.0012 BTC", age: "18m ago", gas: "21000", status: "success" },
  { hash: "0x3312...aabc", from: "0xYZA...567", to: "0xBCD...890", value: "12.0 BTC",  age: "24m ago", gas: "63000", status: "failed"  },
];

const SAMPLE_BLOCKS = [
  { height: 834_210, hash: "0000...f23a", txns: 3142, miner: "AntPool",   reward: "6.25 BTC",  time: "2m ago"  },
  { height: 834_209, hash: "0000...94ab", txns: 2987, miner: "F2Pool",    reward: "6.25 BTC",  time: "12m ago" },
  { height: 834_208, hash: "0000...ee12", txns: 3289, miner: "Binance",   reward: "6.25 BTC",  time: "22m ago" },
  { height: 834_207, hash: "0000...78cd", txns: 2846, miner: "Foundry",   reward: "6.25 BTC",  time: "34m ago" },
];

const STATS = [
  { label: "Block Height", value: "834,210" },
  { label: "Avg Block Time", value: "9m 48s" },
  { label: "Hash Rate",  value: "624 EH/s" },
  { label: "Mempool Size", value: "41,234 txns" },
  { label: "BTC Price", value: "$67,420" },
  { label: "Network Fees", value: "32 sat/vB" },
];

export default function BlockchainExplorerPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab]       = useState<"blocks" | "txns">("blocks");

  const statusBadge = (s: string) =>
    s === "success" ? "badge-green" : s === "pending" ? "badge-blue" : "badge-red";

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Blockchain Explorer</h1>
        <p className="text-gray-400 text-sm mt-0.5">Inspect blocks, transactions, and wallet activity</p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          className="input flex-1 font-mono" placeholder="Search by hash, block height, or wallet address..." />
        <button className="btn btn-blue">🔍 Search</button>
      </div>

      {/* Network stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="card border-neonBlue/20 p-3 text-center">
            <div className="text-[10px] text-gray-500 uppercase mb-1">{s.label}</div>
            <div className="text-sm font-bold mono text-neonBlue">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10">
        {(["blocks", "txns"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? "text-neonBlue border-b-2 border-neonBlue" : "text-gray-500 hover:text-gray-300"}`}>
            {t === "blocks" ? "⬡ Latest Blocks" : "📄 Transactions"}
          </button>
        ))}
      </div>

      {/* Blocks table */}
      {tab === "blocks" && (
        <div className="card border-neonBlue/20 p-4">
          <table className="data-table">
            <thead><tr>
              <th>Height</th>
              <th>Hash</th>
              <th>Txns</th>
              <th>Miner</th>
              <th>Reward</th>
              <th>Time</th>
            </tr></thead>
            <tbody>
              {SAMPLE_BLOCKS.map((b) => (
                <tr key={b.height}>
                  <td className="mono text-neonBlue">{b.height.toLocaleString()}</td>
                  <td className="mono text-gray-400 text-xs">{b.hash}</td>
                  <td className="mono">{b.txns.toLocaleString()}</td>
                  <td className="text-gray-300">{b.miner}</td>
                  <td className="mono text-finGreen">{b.reward}</td>
                  <td className="text-gray-500 text-xs">{b.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Txns table */}
      {tab === "txns" && (
        <div className="card border-neonBlue/20 p-4">
          <table className="data-table">
            <thead><tr>
              <th>Hash</th>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
              <th>Gas</th>
              <th>Age</th>
              <th>Status</th>
            </tr></thead>
            <tbody>
              {SAMPLE_TXN.map((t) => (
                <tr key={t.hash}>
                  <td className="mono text-neonBlue text-xs">{t.hash}</td>
                  <td className="mono text-gray-400 text-xs">{t.from}</td>
                  <td className="mono text-gray-400 text-xs">{t.to}</td>
                  <td className="mono text-white">{t.value}</td>
                  <td className="mono text-gray-400">{t.gas}</td>
                  <td className="text-gray-500 text-xs">{t.age}</td>
                  <td><span className={`badge ${statusBadge(t.status)}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

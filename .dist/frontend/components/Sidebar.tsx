"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/",                     label: "Dashboard",          icon: "⬡" },
  { href: "/trading-bot",          label: "Trading Bot",        icon: "📈" },
  { href: "/sentiment",            label: "Sentiment Analysis", icon: "🧠" },
  { href: "/defi-fraud",           label: "DeFi Fraud",         icon: "🔍" },
  { href: "/blockchain-explorer",  label: "Blockchain",         icon: "⛓" },
  { href: "/backtesting",          label: "Backtesting",        icon: "⏮" },
  { href: "/settings",             label: "Settings",           icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen bg-black/90 border-r border-neonBlue/20 flex flex-col flex-shrink-0 sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-neonBlue/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neonBlue to-finGreen flex items-center justify-center text-black font-bold text-sm">
            F
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">FinAI Trader</div>
            <div className="text-[10px] text-neonBlue/60 font-mono">v2.0 · AI Powered</div>
          </div>
        </div>
      </div>

      {/* Live status bar */}
      <div className="px-4 py-2 border-b border-neonBlue/10">
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span className="pulse-dot" />
          <span>Live Market Data</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 pt-3 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] text-gray-600 uppercase font-semibold tracking-widest px-2 mb-2">
          Navigation
        </div>
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-neonBlue/15 text-neonBlue glow-blue border border-neonBlue/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-100"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-neonBlue" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-neonBlue/10">
        <div className="text-[10px] text-gray-600 font-mono">
          © 2025 FinAI Platform
        </div>
      </div>
    </aside>
  );
}

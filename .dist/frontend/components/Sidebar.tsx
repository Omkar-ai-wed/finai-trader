'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/',                   icon: '⬡',  label: 'Dashboard'         },
  { href: '/trading-bot',        icon: '📈', label: 'Trading Bot'        },
  { href: '/sentiment',          icon: '🧠', label: 'Sentiment AI'       },
  { href: '/defi-fraud',         icon: '🔍', label: 'DeFi Fraud'         },
  { href: '/blockchain-explorer',icon: '⛓',  label: 'Blockchain'         },
  { href: '/backtesting',        icon: '⚡', label: 'Backtesting'        },
  { href: '/settings',           icon: '⚙', label: 'Settings'           },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside
      className="sidebar-glass flex flex-col w-56 shrink-0 min-h-screen sticky top-0 z-40"
      style={{ position: 'sticky', top: 0, height: '100vh' }}
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
            style={{
              background: 'linear-gradient(135deg,rgba(0,245,255,0.25),rgba(168,85,247,0.25))',
              border: '1px solid rgba(0,245,255,0.3)',
              boxShadow: '0 0 16px rgba(0,245,255,0.2)',
            }}
          >
            🤖
          </div>
          <div>
            <p className="text-sm font-800 text-gradient-cyan-violet leading-none font-bold">FinAI</p>
            <p className="text-[0.6rem] text-white/30 leading-none mt-0.5 font-mono uppercase tracking-widest">Trader v2.0</p>
          </div>
        </div>
        {/* Status indicator */}
        <div className="flex items-center gap-1.5 mt-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10ffd1] animate-pulse-dot" />
          <span className="text-[0.6rem] font-mono text-[#10ffd1]/70 uppercase tracking-widest">Live Market Data</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="px-2 pb-1.5 text-[0.6rem] uppercase tracking-widest text-white/20 font-semibold">Navigation</p>
        {NAV.map(({ href, icon, label }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
              <span className="text-base w-5 text-center shrink-0">{icon}</span>
              <span className="text-[0.8125rem]">{label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse-dot" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/[0.06]">
        <p className="text-[0.6rem] text-white/20 text-center font-mono">© 2025 FinAI Platform</p>
      </div>
    </aside>
  );
}

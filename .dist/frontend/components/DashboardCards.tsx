'use client';
type Props = {
  portfolioValue: number;
  marketSentiment: string;
  activeTrades: number;
  fraudAlerts: number;
};

export default function DashboardCards({ portfolioValue, marketSentiment, activeTrades, fraudAlerts }: Props) {
  const isUp = portfolioValue >= 10000;
  const sentimentColor =
    marketSentiment === 'Bullish' ? 'text-glow-green' :
    marketSentiment === 'Bearish' ? 'text-glow-red'   : 'text-glow-violet';

  const cards = [
    { label:'Total Portfolio',    value:`$${portfolioValue.toLocaleString('en-US',{minimumFractionDigits:2})}`,
      sub: `${isUp?'+':''} vs baseline`, icon:'💰', card:'stat-card-cyan',   text:'text-glow-cyan'                                   },
    { label:'Market Sentiment',   value: marketSentiment,
      sub:'NLP Analysis',         icon:'🧠', card:'stat-card-violet', text: sentimentColor                                           },
    { label:'Active Trades',      value: activeTrades.toString(),
      sub:'Open Positions',       icon:'📊', card:'stat-card-green',  text:'text-glow-green'                                         },
    { label:'Fraud Alerts',       value: fraudAlerts.toString(),
      sub:'DeFi Detections',      icon:'🚨', card: fraudAlerts > 0 ? 'stat-card-red' : 'stat-card-cyan',
      text: fraudAlerts > 0 ? 'text-glow-red' : 'text-white/60'                                                                       },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className={`stat-card ${c.card} animate-fade-in-up`}>
          <div className="flex items-start justify-between">
            <p className="metric-label">{c.label}</p>
            <span className="text-xl">{c.icon}</span>
          </div>
          <p className={`metric-value mt-2 ${c.text}`}>{c.value}</p>
          <p className="text-[0.65rem] text-white/25 mt-1">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

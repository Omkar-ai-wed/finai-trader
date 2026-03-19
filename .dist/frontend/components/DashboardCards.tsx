type Props = {
  portfolioValue: number;
  marketSentiment: string;
  activeTrades: number;
  fraudAlerts: number;
};

const sentimentColor = (s: string) =>
  s === "Bullish" ? "text-finGreen text-glow-green" :
  s === "Bearish" ? "text-danger text-glow-red" :
  "text-neonBlue";

export default function DashboardCards(props: Props) {
  const cards = [
    {
      label: "Total Portfolio Value",
      value: `$${props.portfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: "Live NAV",
      color: "text-finGreen",
      border: "border-finGreen/20",
      glow: "glow-green",
      icon: "💰",
    },
    {
      label: "Market Sentiment",
      value: props.marketSentiment,
      sub: "NLP Analysis",
      color: sentimentColor(props.marketSentiment),
      border: "border-neonBlue/20",
      glow: "",
      icon: "🧠",
    },
    {
      label: "Active Trades",
      value: props.activeTrades.toString(),
      sub: "Open Positions",
      color: "text-white",
      border: "border-neonBlue/20",
      glow: "",
      icon: "📊",
    },
    {
      label: "Fraud Alerts",
      value: props.fraudAlerts.toString(),
      sub: "DeFi Detections",
      color: props.fraudAlerts > 0 ? "text-danger text-glow-red" : "text-gray-400",
      border: props.fraudAlerts > 0 ? "border-danger/30" : "border-gray-700/30",
      glow: props.fraudAlerts > 0 ? "glow-red" : "",
      icon: "🚨",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`card ${c.border} ${c.glow} p-4 animate-fade-in`}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
              {c.label}
            </span>
            <span className="text-lg">{c.icon}</span>
          </div>
          <div className={`text-2xl font-bold ${c.color} mono`}>{c.value}</div>
          <div className="text-[11px] text-gray-500 mt-1">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

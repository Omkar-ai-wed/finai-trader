"use client";

import {
  RadialBarChart,
  RadialBar,
  Cell,
  ResponsiveContainer,
} from "recharts";

type Props = { score: number }; // 0..1

const LABELS = ["Extreme Bear", "Bearish", "Neutral", "Bullish", "Extreme Bull"];
const COLORS = ["#ff4444", "#ff7a44", "#8b8b8b", "#44c8ff", "#00ff7f"];

function getSentimentLabel(score: number) {
  if (score < 0.2) return { label: "Extreme Bear", color: "#ff4444" };
  if (score < 0.4) return { label: "Bearish",      color: "#ff7a44" };
  if (score < 0.6) return { label: "Neutral",      color: "#8b8b8b" };
  if (score < 0.8) return { label: "Bullish",      color: "#44c8ff" };
  return              { label: "Extreme Bull",  color: "#00ff7f" };
}

export default function SentimentGauge({ score }: Props) {
  const pct = Math.round(score * 100);
  const { label, color } = getSentimentLabel(score);

  const data = [
    { name: "score", value: pct },
    { name: "empty", value: 100 - pct },
  ];

  return (
    <div className="card border-neonBlue/20 p-4">
      <div className="text-sm font-semibold text-white mb-2">Sentiment Gauge</div>
      <div className="flex items-center gap-4">
        {/* Arc chart */}
        <div style={{ width: 120, height: 120 }} className="flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="60%"
              innerRadius="65%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              data={data}
            >
              <RadialBar dataKey="value" cornerRadius={4}>
                <Cell key="score" fill={color} />
                <Cell key="empty" fill="rgba(255,255,255,0.05)" />
              </RadialBar>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        {/* Labels */}
        <div>
          <div className="text-3xl font-bold mono" style={{ color }}>{pct}%</div>
          <div className="text-sm font-medium mt-0.5" style={{ color }}>{label}</div>
          <div className="text-[11px] text-gray-500 mt-2">
            0 = Full Bearish · 100 = Full Bullish
          </div>

          {/* Mini legend */}
          <div className="flex gap-1 mt-3 flex-wrap">
            {LABELS.map((l, i) => (
              <span
                key={l}
                className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: COLORS[i] + "22",
                  color: COLORS[i],
                  border: `1px solid ${COLORS[i]}44`,
                  fontWeight: l === label ? 700 : 400,
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

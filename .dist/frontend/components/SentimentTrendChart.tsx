"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type DataPoint = {
  time: string;
  bullish: number;
  neutral: number;
  bearish: number;
};

type Props = { data: DataPoint[] };

export default function SentimentTrendChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="card border-neonBlue/20 p-4">
        <div className="text-sm font-semibold text-white mb-2">Sentiment Trend</div>
        <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
          Run sentiment analysis to see the trend graph
        </div>
      </div>
    );
  }

  return (
    <div className="card border-neonBlue/20 p-4">
      <div className="text-sm font-semibold text-white mb-3">Sentiment Trend</div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <Tooltip
            contentStyle={{ background: "#0a0d1a", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8, fontSize: 11 }}
            formatter={(v: number) => `${(v * 100).toFixed(1)}%`}
          />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="bullish" stroke="#00ff7f" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="neutral"  stroke="#00e5ff" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="bearish"  stroke="#ff4444" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

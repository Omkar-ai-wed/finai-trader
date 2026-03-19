"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

type DataPoint = { date: string; value: number };

type Props = {
  data: DataPoint[];
  startVal?: number;
};

export default function BacktestChart({ data, startVal = 10000 }: Props) {
  const finalVal = data.at(-1)?.value ?? startVal;
  const returnPct = ((finalVal - startVal) / startVal * 100).toFixed(2);
  const positive = finalVal >= startVal;

  return (
    <div className="card border-neonBlue/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-white">Equity Curve</div>
        <div className={`text-sm font-bold mono ${positive ? "text-finGreen" : "text-danger"}`}>
          {positive ? "+" : ""}{returnPct}%
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={positive ? "#00ff7f" : "#ff4444"} stopOpacity={0.3} />
              <stop offset="95%" stopColor={positive ? "#00ff7f" : "#ff4444"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: "#6b7280", fontSize: 9 }} tickLine={false} axisLine={false} width={62} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ background: "#0a0d1a", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8, fontSize: 11 }}
            formatter={(v: number) => [`$${v.toLocaleString()}`, "Portfolio"]}
          />
          <ReferenceLine y={startVal} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 2" />
          <Area type="monotone" dataKey="value" stroke={positive ? "#00ff7f" : "#ff4444"} strokeWidth={1.5} fill="url(#equityGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

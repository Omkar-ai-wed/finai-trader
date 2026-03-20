'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

type DataPoint = { t: string; bull: number; bear: number; neutral: number };
type Props = { data: DataPoint[] };

export default function SentimentTrendChart({ data }: Props) {
  if (!data.length) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Generating trend data…</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 120 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="t"
            tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} axisLine={false}
            domain={[0, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip
            contentStyle={{ background: 'rgba(6,6,15,0.92)', border: '1px solid rgba(0,245,255,0.2)',
              borderRadius: 10, fontSize: 11, backdropFilter: 'blur(12px)' }}
            labelStyle={{ color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}
            formatter={(v: number) => [`${v}%`]}
          />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }} />
          <Line type="monotone" dataKey="bull"    name="Bullish"  stroke="#10ffd1" strokeWidth={2} dot={false}
            style={{ filter: 'drop-shadow(0 0 4px #10ffd180)' }} />
          <Line type="monotone" dataKey="neutral" name="Neutral"  stroke="#00f5ff" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
          <Line type="monotone" dataKey="bear"    name="Bearish"  stroke="#ff3d6e" strokeWidth={2} dot={false}
            style={{ filter: 'drop-shadow(0 0 4px #ff3d6e80)' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

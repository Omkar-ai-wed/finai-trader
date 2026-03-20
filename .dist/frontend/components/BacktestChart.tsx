'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

type DataPoint = { date: string; value: number };
type Props = { data: DataPoint[]; startVal?: number };

export default function BacktestChart({ data, startVal = 10000 }: Props) {
  const finalVal   = data.at(-1)?.value ?? startVal;
  const returnPct  = ((finalVal - startVal) / startVal * 100).toFixed(2);
  const positive   = finalVal >= startVal;
  const color      = positive ? '#10ffd1' : '#ff3d6e';

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 120 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} axisLine={false} width={62}
            tickFormatter={v => `$${(v/1000).toFixed(1)}k`} domain={['auto','auto']} />
          <Tooltip
            contentStyle={{ background: 'rgba(6,6,15,0.9)', border: `1px solid ${color}33`, borderRadius: 10, fontSize: 11, backdropFilter: 'blur(12px)' }}
            labelStyle={{ color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}
            formatter={(v: number) => [`$${v.toLocaleString()}`, 'Portfolio']}
          />
          <ReferenceLine y={startVal} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 2" />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2}
            fill="url(#equityGrad2)" dot={false}
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

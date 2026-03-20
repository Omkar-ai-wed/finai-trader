'use client';
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type DataPoint = { time: string; price: number; ma20?: number };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(6,6,15,0.92)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 10, padding: '8px 12px', fontSize: 11, backdropFilter: 'blur(12px)' }}>
      <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function PriceChart({ data, rsi, macd, macdSignal }: {
  data: DataPoint[]; rsi?: number; macd?: number; macdSignal?: number;
}) {
  const lastPrice  = data.at(-1)?.price  ?? 0;
  const firstPrice = data[0]?.price ?? 0;
  const priceUp    = lastPrice >= firstPrice;
  const lineColor  = priceUp ? '#10ffd1' : '#ff3d6e';

  if (!data.length) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Start bot to stream price data…</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={lineColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#4b5563', fontSize: 9 }} tickLine={false} axisLine={false} width={68}
            tickFormatter={v => `$${(v/1000).toFixed(1)}k`} domain={['auto','auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="price" name="Price"
            stroke={lineColor} strokeWidth={2}
            fill="url(#priceGrad2)" dot={false}
            style={{ filter: `drop-shadow(0 0 4px ${lineColor}90)` }}
            activeDot={{ r: 4, fill: lineColor, stroke: 'transparent' }} />
          {data.some(d => d.ma20) && (
            <Line type="monotone" dataKey="ma20" name="MA20"
              stroke="#a855f7" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Indicators Row */}
      {(rsi !== undefined || macd !== undefined) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
          {[[
            'RSI (14)', rsi?.toFixed(1) ?? '—',
            rsi !== undefined && rsi > 70 ? '#ff3d6e' : rsi !== undefined && rsi < 30 ? '#10ffd1' : 'rgba(255,255,255,0.5)'
          ],[
            'MACD', macd?.toFixed(2) ?? '—',
            macd !== undefined && macd > 0 ? '#10ffd1' : '#ff3d6e'
          ],[
            'Signal', macdSignal?.toFixed(2) ?? '—', '#00f5ff'
          ]].map(([k,v,c]) => (
            <div key={String(k)} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{k}</p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: String(c) }}>{v}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

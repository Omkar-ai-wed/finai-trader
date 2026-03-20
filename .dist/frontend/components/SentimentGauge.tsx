'use client';
import { RadialBarChart, RadialBar, Cell, ResponsiveContainer } from 'recharts';

type Props = { score: number }; // 0..1

const BANDS = [
  { label: 'Extreme Bear', min: 0,    color: '#ff3d6e' },
  { label: 'Bearish',      min: 0.2,  color: '#f97316' },
  { label: 'Neutral',      min: 0.4,  color: '#6b7280' },
  { label: 'Bullish',      min: 0.6,  color: '#00f5ff' },
  { label: 'Extreme Bull', min: 0.8,  color: '#10ffd1' },
];

function getInfo(score: number) {
  return [...BANDS].reverse().find(b => score >= b.min) ?? BANDS[0];
}

export default function SentimentGauge({ score }: Props) {
  const pct       = Math.round(score * 100);
  const { label, color } = getInfo(score);
  const data = [{ value: pct }, { value: 100 - pct }];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.5rem 0' }}>
      {/* Radial Arc */}
      <div style={{ width: 130, height: 130, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="68%" innerRadius="60%" outerRadius="100%"
            startAngle={180} endAngle={0} data={data}>
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'rgba(255,255,255,0.04)' }}>
              <Cell fill={color} style={{ filter: `drop-shadow(0 0 8px ${color}80)` }} />
              <Cell fill="transparent" />
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Right side info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 800, color, lineHeight: 1,
          textShadow: `0 0 16px ${color}90` }}>{pct}%</p>
        <p style={{ fontSize: 13, fontWeight: 600, color, marginTop: 4 }}>{label}</p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 8, lineHeight: 1.5 }}>
          0 = Full Bearish · 100 = Full Bullish
        </p>
        {/* Band pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
          {BANDS.map(b => (
            <span key={b.label} style={{
              fontSize: 9, padding: '2px 7px', borderRadius: 9999, fontWeight: b.label === label ? 700 : 400,
              background: b.color + '18', color: b.color, border: `1px solid ${b.color}${b.label === label ? '55' : '25'}`,
            }}>{b.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

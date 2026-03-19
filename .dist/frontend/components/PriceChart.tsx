"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

type DataPoint = { time: string; price: number; ma20?: number };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card border-neonBlue/30 p-2 text-xs">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? `$${p.value.toFixed(2)}` : p.value}
        </div>
      ))}
    </div>
  );
};

export default function PriceChart({ data, rsi, macd, macdSignal }: {
  data: DataPoint[];
  rsi?: number;
  macd?: number;
  macdSignal?: number;
}) {
  const lastPrice = data.at(-1)?.price ?? 0;
  const firstPrice = data[0]?.price ?? 0;
  const priceUp = lastPrice >= firstPrice;

  return (
    <div className="card border-neonBlue/20 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white">BTC/USDT Price</div>
        <div className="flex gap-3 text-[11px]">
          {rsi !== undefined && (
            <span className={`font-mono ${rsi > 70 ? "text-danger" : rsi < 30 ? "text-finGreen" : "text-gray-400"}`}>
              RSI {rsi.toFixed(1)}
            </span>
          )}
          {macd !== undefined && (
            <span className={`font-mono ${macd > 0 ? "text-finGreen" : "text-danger"}`}>
              MACD {macd.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Main Price Chart */}
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={priceUp ? "#00ff7f" : "#ff4444"} stopOpacity={0.25} />
                <stop offset="95%" stopColor={priceUp ? "#00ff7f" : "#ff4444"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#6b7280", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={68}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={priceUp ? "#00ff7f" : "#ff4444"}
              strokeWidth={1.5}
              fill="url(#priceGrad)"
              dot={false}
              activeDot={{ r: 4, fill: priceUp ? "#00ff7f" : "#ff4444" }}
            />
            {data.some((d) => d.ma20) && (
              <Line
                type="monotone"
                dataKey="ma20"
                stroke="#00e5ff"
                strokeWidth={1}
                dot={false}
                strokeDasharray="4 2"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Indicator row */}
      {(rsi !== undefined || macd !== undefined) && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px]">
          <div>
            <div className="text-gray-500 mb-0.5">RSI (14)</div>
            <div className={`font-mono font-semibold ${
              rsi !== undefined && rsi > 70 ? "text-danger" :
              rsi !== undefined && rsi < 30 ? "text-finGreen" : "text-white"
            }`}>
              {rsi?.toFixed(2) ?? "—"}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-0.5">MACD</div>
            <div className={`font-mono font-semibold ${macd !== undefined && macd > 0 ? "text-finGreen" : "text-danger"}`}>
              {macd?.toFixed(4) ?? "—"}
            </div>
          </div>
          <div>
            <div className="text-gray-500 mb-0.5">Signal</div>
            <div className="font-mono font-semibold text-neonBlue">
              {macdSignal?.toFixed(4) ?? "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

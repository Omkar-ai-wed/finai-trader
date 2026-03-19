"use client";

import { useMemo } from "react";

type Node = { id: string; label?: string; risk?: number };
type Edge = { from: string; to: string; value?: number };

type Props = {
  nodes?: string[] | Node[];
  edges?: { from: string; to: string; value?: number }[];
  nodeScores?: Record<string, number>;
};

function riskColor(score: number) {
  if (score > 0.75) return "#ff4444";
  if (score > 0.5)  return "#ff9944";
  if (score > 0.3)  return "#ffdd44";
  return "#00ff7f";
}

function riskLabel(score: number) {
  if (score > 0.75) return "HIGH";
  if (score > 0.5)  return "MED";
  if (score > 0.3)  return "LOW";
  return "SAFE";
}

export default function NetworkGraph({ nodes = [], edges = [], nodeScores = {} }: Props) {
  // Normalize nodes to Node[]
  const normalizedNodes: Node[] = nodes.map((n) =>
    typeof n === "string" ? { id: n } : n
  );

  if (!normalizedNodes.length) {
    return (
      <div className="card border-neonBlue/20 p-4">
        <div className="text-sm font-semibold text-white mb-3">Transaction Network Graph</div>
        <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
          Scan a wallet to visualize the transaction network
        </div>
      </div>
    );
  }

  // Simple circular layout
  const W = 560, H = 320;
  const cx = W / 2, cy = H / 2;
  const r = Math.min(cx, cy) - 60;

  const positions: Record<string, { x: number; y: number }> = {};
  normalizedNodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / normalizedNodes.length - Math.PI / 2;
    positions[n.id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <div className="card border-neonBlue/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-white">Transaction Network Graph</div>
        <div className="flex gap-2 text-[10px]">
          {[["HIGH", "#ff4444"], ["MED", "#ff9944"], ["SAFE", "#00ff7f"]].map(([l, c]) => (
            <span key={l} className="flex items-center gap-1">
              <span style={{ background: c as string }} className="w-2 h-2 rounded-full inline-block" />
              <span className="text-gray-400">{l}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg" style={{ background: "rgba(0,0,0,0.4)" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxHeight: 320 }}>
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={0} y1={i * 60} x2={W} y2={i * 60}
              stroke="rgba(0,229,255,0.04)" strokeWidth={1} />
          ))}

          {/* Edges */}
          {edges.map((e, i) => {
            const src = positions[e.from];
            const dst = positions[e.to];
            if (!src || !dst) return null;
            return (
              <line
                key={i}
                x1={src.x} y1={src.y} x2={dst.x} y2={dst.y}
                stroke="rgba(0,229,255,0.2)" strokeWidth={1.5}
              />
            );
          })}

          {/* Nodes */}
          {normalizedNodes.map((n) => {
            const pos = positions[n.id];
            if (!pos) return null;
            const score = nodeScores[n.id] ?? n.risk ?? 0.1;
            const color = riskColor(score);
            const label = n.label ?? (n.id.length > 10 ? n.id.slice(0, 8) + "..." : n.id);
            return (
              <g key={n.id}>
                {/* Glow ring */}
                <circle cx={pos.x} cy={pos.y} r={14} fill={color} opacity={0.12} />
                {/* Node */}
                <circle cx={pos.x} cy={pos.y} r={9} fill={color} opacity={0.9} />
                {/* Label */}
                <text
                  x={pos.x} y={pos.y + 22}
                  textAnchor="middle" fill="#9ca3af"
                  fontSize={8} fontFamily="monospace"
                >
                  {label}
                </text>
                {/* Risk badge */}
                <text
                  x={pos.x} y={pos.y + 3.5}
                  textAnchor="middle" fill="#000"
                  fontSize={6} fontWeight="bold" fontFamily="monospace"
                >
                  {riskLabel(score)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
        <div><span className="text-gray-500">Wallets:</span> <span className="text-white font-mono">{normalizedNodes.length}</span></div>
        <div><span className="text-gray-500">Edges:</span> <span className="text-white font-mono">{edges.length}</span></div>
        <div>
          <span className="text-gray-500">High Risk:</span>{" "}
          <span className="text-danger font-mono">
            {Object.values(nodeScores).filter((s) => s > 0.75).length}
          </span>
        </div>
      </div>
    </div>
  );
}

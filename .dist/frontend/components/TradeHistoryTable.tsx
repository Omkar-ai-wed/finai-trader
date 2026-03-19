"use client";

type Trade = {
  id?: number;
  side: string;
  price: number;
  quantity?: number;
  qty?: number;
  pnl: number;
  timestamp: string;
  symbol?: string;
};

type Props = { trades: Trade[] };

export default function TradeHistoryTable({ trades }: Props) {
  if (!trades.length) {
    return (
      <div className="card border-neonBlue/20 p-4">
        <div className="text-sm font-semibold text-white mb-3">Trade History</div>
        <div className="text-center text-gray-500 text-sm py-6">
          No trades yet. Start the bot to see live trades.
        </div>
      </div>
    );
  }

  return (
    <div className="card border-neonBlue/20 p-4">
      <div className="text-sm font-semibold text-white mb-3">Trade History</div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Side</th>
              <th>Price</th>
              <th>Qty</th>
              <th>PnL</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {[...trades].reverse().map((t, i) => {
              const qty = t.quantity ?? t.qty ?? 0;
              const isBuy = t.side === "BUY";
              return (
                <tr key={i} className="animate-fade-in">
                  <td className="text-gray-500 font-mono">{t.id ?? trades.length - i}</td>
                  <td>
                    <span className={`badge ${isBuy ? "badge-green" : "badge-red"}`}>
                      {t.side}
                    </span>
                  </td>
                  <td className="font-mono text-white">${t.price.toLocaleString()}</td>
                  <td className="font-mono text-gray-300">{qty.toFixed ? qty.toFixed(5) : qty}</td>
                  <td className={`font-mono font-semibold ${t.pnl >= 0 ? "text-finGreen" : "text-danger"}`}>
                    {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                  </td>
                  <td className="text-gray-500 font-mono text-[10px]">
                    {typeof t.timestamp === "string"
                      ? t.timestamp.slice(11, 19)
                      : new Date(t.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

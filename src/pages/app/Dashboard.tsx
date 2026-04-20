import { useStore } from "@/lib/store";
import { getExpiryStatus, daysUntil, statusColor, statusLabel } from "@/lib/expiry";
import { Package, AlertTriangle, TrendingDown, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Stat = ({ icon: Icon, label, value, accent }: any) => (
  <div className="glass-card rounded-2xl p-5">
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <Icon className={`h-4 w-4 ${accent || "text-accent"}`} />
    </div>
    <div className="mt-3 font-display text-3xl font-bold">{value}</div>
  </div>
);

export default function Dashboard() {
  const products = useStore((s) => s.products);
  const batchesRaw = useStore((s) => s.batches);
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const batches = [...batchesRaw]
    .sort((a, b) => a.expiry_date.localeCompare(b.expiry_date))
    .map((b) => ({ ...b, products: productMap[b.product_id] ? { name: productMap[b.product_id].name, unit_price: productMap[b.product_id].unit_price } : null }));

  const totalProducts = products.length;
  const expiring = batches.filter((b) => getExpiryStatus(b.expiry_date) === "expiring");
  const expired = batches.filter((b) => getExpiryStatus(b.expiry_date) === "expired");
  const valueAtRisk = [...expiring, ...expired].reduce(
    (s, b: any) => s + (b.products?.unit_price ?? 0) * b.quantity, 0,
  );

  const urgent = batches.filter((b) => getExpiryStatus(b.expiry_date) !== "safe").slice(0, 8);

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">A quick read on what's safe, what's expiring, and what's already lost.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat icon={Package} label="Products" value={totalProducts} />
        <Stat icon={AlertTriangle} label="Expiring soon" value={expiring.length} accent="text-warning" />
        <Stat icon={TrendingDown} label="Expired" value={expired.length} accent="text-danger" />
        <Stat icon={DollarSign} label="Value at risk" value={`$${valueAtRisk.toFixed(0)}`} />
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">Urgent items</h2>
          <Link to="/app/alerts" className="text-sm text-accent hover:underline">View all alerts →</Link>
        </div>
        {urgent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            🎉 Nothing urgent. All stock is within safe windows.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground text-xs uppercase tracking-wider">
                <tr><th className="py-2">Product</th><th>Qty</th><th>Expiry</th><th>Status</th></tr>
              </thead>
              <tbody>
                {urgent.map((b: any) => {
                  const s = getExpiryStatus(b.expiry_date);
                  const d = daysUntil(b.expiry_date);
                  return (
                    <tr key={b.id} className="border-t border-border/50">
                      <td className="py-3 font-medium">{b.products?.name}</td>
                      <td>{b.quantity}</td>
                      <td className="text-muted-foreground">{new Date(b.expiry_date).toLocaleDateString()} <span className="text-xs">({d >= 0 ? `${d}d left` : `${Math.abs(d)}d ago`})</span></td>
                      <td><span className={`text-xs px-2 py-1 rounded-full border ${statusColor(s)}`}>{statusLabel(s)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getExpiryStatus, daysUntil, statusColor, statusLabel } from "@/lib/expiry";
import { Bell } from "lucide-react";

export default function Alerts() {
  const { data: batches = [] } = useQuery({
    queryKey: ["alerts-batches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batches")
        .select("*, products(name, unit_price, categories(name, warn_days))")
        .order("expiry_date", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

  const grouped = {
    expired: batches.filter((b) => getExpiryStatus(b.expiry_date) === "expired"),
    expiring: batches.filter((b) => getExpiryStatus(b.expiry_date) === "expiring"),
    safe: batches.filter((b) => getExpiryStatus(b.expiry_date) === "safe"),
  };

  const Section = ({ title, items, tone }: any) => (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className={`h-4 w-4 ${tone}`} />
        <h2 className="font-display font-semibold text-lg">{title}</h2>
        <span className="text-xs text-muted-foreground">({items.length})</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here.</p>
      ) : (
        <div className="space-y-2">
          {items.map((b: any) => {
            const s = getExpiryStatus(b.expiry_date);
            const d = daysUntil(b.expiry_date);
            return (
              <div key={b.id} className="flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-3">
                <div>
                  <div className="font-medium">{b.products?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.quantity} units · ${(Number(b.products?.unit_price || 0) * b.quantity).toFixed(2)} value · {new Date(b.expiry_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full border ${statusColor(s)}`}>{statusLabel(s)}</span>
                  <div className="text-xs text-muted-foreground mt-1">{d >= 0 ? `${d}d left` : `${Math.abs(d)}d ago`}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold">Alerts</h1>
        <p className="text-muted-foreground mt-1">Prioritised by urgency. Act before it costs you.</p>
      </div>
      <Section title="Expired" items={grouped.expired} tone="text-danger" />
      <Section title="Expiring soon" items={grouped.expiring} tone="text-warning" />
      <Section title="Safe" items={grouped.safe} tone="text-success" />
    </div>
  );
}

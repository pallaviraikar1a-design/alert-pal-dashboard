import { useState } from "react";
import {
  useProducts, useCategories, useSuppliers, useBatches,
  useAddProduct, useDeleteProduct, useAddBatch,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Search, Download, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { getExpiryStatus, daysUntil, statusColor, statusLabel } from "@/lib/expiry";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [openProd, setOpenProd] = useState(false);
  const [openBatch, setOpenBatch] = useState<string | null>(null);

  const { data: productsRaw = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: suppliers = [] } = useSuppliers();
  const { data: batches = [] } = useBatches();
  const addProductMut = useAddProduct();
  const delProductMut = useDeleteProduct();
  const addBatchMut = useAddBatch();

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const supMap = Object.fromEntries(suppliers.map((s) => [s.id, s]));
  const products = productsRaw.map((p) => ({
    ...p,
    categories: p.category_id ? catMap[p.category_id] : null,
    suppliers: p.supplier_id ? supMap[p.supplier_id] : null,
    batches: batches.filter((b) => b.product_id === p.id),
  }));

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddProduct = async (form: any) => {
    try {
      await addProductMut.mutateAsync({
        name: form.name,
        sku: form.sku || null,
        category_id: form.category_id || null,
        supplier_id: form.supplier_id || null,
        unit_price: parseFloat(form.unit_price) || 0,
        low_stock_threshold: parseInt(form.low_stock_threshold) || 5,
      });
      toast.success("Product added");
      setOpenProd(false);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleAddBatch = async ({ product_id, quantity, expiry_date }: any) => {
    try {
      await addBatchMut.mutateAsync({ product_id, quantity: parseInt(quantity), expiry_date });
      toast.success("Batch added");
      setOpenBatch(null);
    } catch (err: any) { toast.error(err.message); }
  };

  const exportCSV = () => {
    const rows = [["Name", "SKU", "Category", "Supplier", "Unit Price", "Total Qty", "Earliest Expiry"]];
    filtered.forEach((p) => {
      const totalQty = p.batches.reduce((s, b) => s + b.quantity, 0);
      const earliest = p.batches.length
        ? p.batches.reduce((min, b) => (b.expiry_date < min ? b.expiry_date : min), p.batches[0].expiry_date)
        : "";
      rows.push([p.name, p.sku || "", p.categories?.name || "", p.suppliers?.name || "", String(p.unit_price), String(totalQty), earliest]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground mt-1">Every product, every batch, every expiry.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={exportCSV} className="border border-border"><Download className="h-4 w-4" /> Export</Button>
          <Dialog open={openProd} onOpenChange={setOpenProd}>
            <DialogTrigger asChild><Button variant="accent" className="rounded-full"><Plus className="h-4 w-4" /> Add product</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New product</DialogTitle></DialogHeader>
              <ProductForm onSubmit={handleAddProduct} categories={categories} suppliers={suppliers} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU…" className="pl-9" />
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <PackagePlus className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No products yet. Add your first one to start tracking expiry.</p>
          </div>
        )}
        {filtered.map((p) => {
          const totalQty = p.batches.reduce((s, b) => s + b.quantity, 0);
          const lowStock = totalQty <= p.low_stock_threshold;
          return (
            <div key={p.id} className="glass-card rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-lg">{p.name}</h3>
                    {p.sku && <span className="text-xs text-muted-foreground">SKU: {p.sku}</span>}
                    {p.categories && (
                      <span className="text-xs px-2 py-0.5 rounded-full border border-border" style={{ background: `${p.categories.color}22`, color: p.categories.color }}>
                        {p.categories.name}
                      </span>
                    )}
                    {lowStock && <span className="text-xs px-2 py-0.5 rounded-full bg-danger/15 text-danger border border-danger/30">Low stock</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {p.suppliers?.name && `Supplier: ${p.suppliers.name} · `}
                    Unit ${Number(p.unit_price).toFixed(2)} · Total qty: <span className="text-foreground font-medium">{totalQty}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog open={openBatch === p.id} onOpenChange={(o) => setOpenBatch(o ? p.id : null)}>
                    <DialogTrigger asChild><Button size="sm" variant="hero" className="rounded-full"><Plus className="h-3 w-3" /> Batch</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Add batch — {p.name}</DialogTitle></DialogHeader>
                      <BatchForm onSubmit={(f: any) => handleAddBatch({ ...f, product_id: p.id })} />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="ghost" onClick={async () => { if (confirm("Delete this product and all its batches?")) { try { await delProductMut.mutateAsync(p.id); toast.success("Product deleted"); } catch (e: any) { toast.error(e.message); } } }}>
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </div>
              {p.batches.length > 0 && (
                <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {[...p.batches].sort((a, b) => a.expiry_date.localeCompare(b.expiry_date)).map((b) => {
                    const s = getExpiryStatus(b.expiry_date, p.categories?.warn_days);
                    const d = daysUntil(b.expiry_date);
                    return (
                      <div key={b.id} className="flex items-center justify-between rounded-xl bg-secondary/40 px-3 py-2 text-sm">
                        <div>
                          <div className="font-medium">{b.quantity} units</div>
                          <div className="text-xs text-muted-foreground">{new Date(b.expiry_date).toLocaleDateString()} · {d >= 0 ? `${d}d left` : `${Math.abs(d)}d ago`}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor(s)}`}>{statusLabel(s)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductForm({ onSubmit, categories, suppliers }: any) {
  const [form, setForm] = useState({ name: "", sku: "", category_id: "", supplier_id: "", unit_price: "0", low_stock_threshold: "5" });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div><Label>Name *</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
        <div><Label>Unit price</Label><Input type="number" step="0.01" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Category</Label>
          <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
            <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>{categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Supplier</Label>
          <Select value={form.supplier_id} onValueChange={(v) => setForm({ ...form, supplier_id: v })}>
            <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>{suppliers.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div><Label>Low-stock threshold</Label><Input type="number" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })} /></div>
      <DialogFooter><Button type="submit" variant="accent">Add product</Button></DialogFooter>
    </form>
  );
}

function BatchForm({ onSubmit }: any) {
  const [form, setForm] = useState({ quantity: "1", expiry_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10) });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div><Label>Quantity *</Label><Input type="number" required min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
      <div><Label>Expiry date *</Label><Input type="date" required value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} /></div>
      <DialogFooter><Button type="submit" variant="accent">Add batch</Button></DialogFooter>
    </form>
  );
}

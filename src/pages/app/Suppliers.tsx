import { useState } from "react";
import { useSuppliers, useAddSupplier, useDeleteSupplier } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";

export default function Suppliers() {
  const { data: items = [] } = useSuppliers();
  const addMut = useAddSupplier();
  const delMut = useDeleteSupplier();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", contact_email: "", phone: "", notes: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMut.mutateAsync({
        name: form.name,
        contact_email: form.contact_email || null,
        phone: form.phone || null,
        notes: form.notes || null,
      });
      toast.success("Supplier added");
      setOpen(false);
      setForm({ name: "", contact_email: "", phone: "", notes: "" });
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-end justify-between">
        <div><h1 className="font-display text-3xl font-bold">Suppliers</h1><p className="text-muted-foreground mt-1">Who restocks your shelves.</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="accent" className="rounded-full"><Plus className="h-4 w-4" /> Add supplier</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New supplier</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div><Label>Name *</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Email</Label><Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <DialogFooter><Button variant="accent" disabled={addMut.isPending}>Add</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground col-span-full"><Truck className="h-10 w-10 mx-auto mb-3" />No suppliers yet.</div>}
        {items.map((s) => (
          <div key={s.id} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display font-semibold">{s.name}</div>
                {s.contact_email && <div className="text-sm text-muted-foreground">{s.contact_email}</div>}
                {s.phone && <div className="text-sm text-muted-foreground">{s.phone}</div>}
              </div>
              <Button size="sm" variant="ghost" onClick={async () => { try { await delMut.mutateAsync(s.id); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); } }}><Trash2 className="h-4 w-4 text-danger" /></Button>
            </div>
            {s.notes && <p className="text-sm text-muted-foreground mt-3">{s.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

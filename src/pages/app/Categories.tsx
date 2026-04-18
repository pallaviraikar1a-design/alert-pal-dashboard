import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";

export default function Categories() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", color: "#a78bfa", warn_days: "7" });

  const { data: items = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("name")).data || [],
  });

  const add = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("categories").insert({
        user_id: user!.id, name: form.name, color: form.color, warn_days: parseInt(form.warn_days),
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); toast.success("Category added"); setOpen(false); setForm({ name: "", color: "#a78bfa", warn_days: "7" }); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); toast.success("Deleted"); },
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-end justify-between">
        <div><h1 className="font-display text-3xl font-bold">Categories</h1><p className="text-muted-foreground mt-1">Set per-category warning windows.</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="accent" className="rounded-full"><Plus className="h-4 w-4" /> Add category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New category</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); add.mutate(); }} className="space-y-4">
              <div><Label>Name *</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dairy" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Color</Label><Input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
                <div><Label>Warn days before expiry</Label><Input type="number" min="1" value={form.warn_days} onChange={(e) => setForm({ ...form, warn_days: e.target.value })} /></div>
              </div>
              <DialogFooter><Button variant="accent" disabled={add.isPending}>{add.isPending ? "Saving…" : "Add"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <div className="glass-card rounded-2xl p-12 text-center text-muted-foreground col-span-full"><Tag className="h-10 w-10 mx-auto mb-3" />No categories yet.</div>}
        {items.map((c: any) => (
          <div key={c.id} className="glass-card rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl" style={{ background: c.color }} />
              <div>
                <div className="font-display font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">Warn {c.warn_days} days before expiry</div>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => del.mutate(c.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

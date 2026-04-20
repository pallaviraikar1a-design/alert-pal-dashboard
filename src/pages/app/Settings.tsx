import { useState } from "react";
import { store, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Settings() {
  const profile = useStore((s) => s.profile);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [storeName, setStoreName] = useState(profile.store_name);
  const [email, setEmail] = useState(profile.email);

  const save = () => {
    store.updateProfile({ display_name: displayName, store_name: storeName, email });
    toast.success("Profile saved");
  };

  const resetDemo = () => {
    if (confirm("Reset all demo data to its original seeded state?")) {
      store.reset();
      toast.success("Demo data reset");
    }
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Local profile and demo controls.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><Label>Display name</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
        <div><Label>Store name</Label><Input value={storeName} onChange={(e) => setStoreName(e.target.value)} /></div>
        <Button variant="accent" onClick={save} className="rounded-full">Save</Button>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg">Demo data</h2>
        <p className="text-sm text-muted-foreground">All data is stored locally in your browser. Reset to restore the original seeded inventory.</p>
        <Button variant="ghost" onClick={resetDemo} className="border border-border">Reset demo data</Button>
      </div>
    </div>
  );
}

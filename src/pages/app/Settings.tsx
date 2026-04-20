import { useEffect, useState } from "react";
import { useProfile, useUpdateProfile } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const updateMut = useUpdateProfile();
  const [displayName, setDisplayName] = useState("");
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setStoreName(profile.store_name ?? "");
    }
  }, [profile]);

  const save = async () => {
    try {
      await updateMut.mutateAsync({ display_name: displayName, store_name: storeName });
      toast.success("Profile saved");
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Your profile and account.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
        <div><Label>Display name</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
        <div><Label>Store name</Label><Input value={storeName} onChange={(e) => setStoreName(e.target.value)} /></div>
        <Button variant="accent" onClick={save} className="rounded-full" disabled={updateMut.isPending}>Save</Button>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg">Account</h2>
        <p className="text-sm text-muted-foreground">Sign out of this device.</p>
        <Button variant="ghost" onClick={signOut} className="border border-border"><LogOut className="h-4 w-4" /> Sign out</Button>
      </div>
    </div>
  );
}

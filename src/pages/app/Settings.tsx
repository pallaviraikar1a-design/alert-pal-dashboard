import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles", user?.id],
    queryFn: async () => (await supabase.from("user_roles").select("role").eq("user_id", user!.id)).data || [],
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setStoreName(profile.store_name || "");
    }
  }, [profile]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: displayName, store_name: storeName,
    }).eq("user_id", user!.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Your profile and store info.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div><Label>Email</Label><Input value={user?.email || ""} disabled /></div>
        <div><Label>Display name</Label><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
        <div><Label>Store name</Label><Input value={storeName} onChange={(e) => setStoreName(e.target.value)} /></div>
        <div>
          <Label>Role</Label>
          <div className="flex gap-2 mt-2">
            {roles.map((r: any) => (
              <span key={r.role} className="text-xs px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 capitalize">{r.role}</span>
            ))}
          </div>
        </div>
        <Button variant="accent" onClick={save} disabled={saving} className="rounded-full">{saving ? "Saving…" : "Save"}</Button>
      </div>
    </div>
  );
}

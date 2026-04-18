import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Hourglass } from "lucide-react";

const Auth = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(params.get("mode") === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { display_name: displayName, store_name: storeName },
          },
        });
        if (error) throw error;
        toast.success("Welcome aboard! Logging you in…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-8">
        <Link to="/" className="flex items-center justify-center gap-2 font-display font-bold text-lg mb-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-pill shadow-pill">
            <Hourglass className="h-4 w-4 text-accent" />
          </span>
          Expiry Manager <span className="text-accent">Pro</span>
        </Link>
        <h1 className="text-center font-display text-2xl font-bold mt-4">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-center text-sm text-muted-foreground mt-1">
          {mode === "signup" ? "Free forever for your first store." : "Sign in to manage your shelf."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <Label htmlFor="display">Your name</Label>
                <Input id="display" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Marcus Liang" />
              </div>
              <div>
                <Label htmlFor="store">Store name</Label>
                <Input id="store" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Liang's Corner Store" />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" variant="accent" className="w-full rounded-full" disabled={loading}>
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "signup" ? "Already have an account?" : "No account yet?"}{" "}
          <button
            type="button"
            className="text-accent hover:underline font-medium"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;

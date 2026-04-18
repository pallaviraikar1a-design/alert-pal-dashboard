import { Link } from "react-router-dom";
import { Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-pill shadow-pill">
            <Hourglass className="h-4 w-4 text-accent" />
          </span>
          Expiry Manager <span className="text-accent">Pro</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild variant="hero"><Link to="/app">Open app</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost"><Link to="/auth">Sign in</Link></Button>
              <Button asChild variant="hero"><Link to="/auth?mode=signup">Get Started</Link></Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

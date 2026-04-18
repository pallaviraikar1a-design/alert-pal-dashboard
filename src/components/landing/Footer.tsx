import { Hourglass } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border/50 mt-24">
    <div className="container py-12 grid md:grid-cols-4 gap-8 text-sm">
      <div>
        <div className="flex items-center gap-2 font-display font-bold mb-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-pill shadow-pill">
            <Hourglass className="h-4 w-4 text-accent" />
          </span>
          Expiry Manager Pro
        </div>
        <p className="text-muted-foreground">Built for shops that hate waste.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Product</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li><a href="#features" className="hover:text-foreground">Features</a></li>
          <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
          <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Company</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Legal</h4>
        <ul className="space-y-2 text-muted-foreground">
          <li>Privacy</li>
          <li>Terms</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Expiry Manager Pro. All rights reserved.
    </div>
  </footer>
);

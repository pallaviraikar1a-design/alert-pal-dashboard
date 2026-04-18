import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Bell, BarChart3, Tag, Users, Smartphone, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const stats = [
  { v: "30%", l: "Average shelf-loss reduction" },
  { v: "10s", l: "To log a new product" },
  { v: "24/7", l: "Live expiry monitoring" },
  { v: "500+", l: "Stores tracking with us" },
];

const problems = [
  { e: "💸", t: "Money rotting on the shelf", d: "Most independent stores throw away 5–15% of perishable stock every month. That's pure profit in the bin." },
  { e: "📒", t: "Spreadsheets that nobody updates", d: "Excel files, paper notebooks, sticky notes — by Friday no one knows what's actually expiring." },
  { e: "😵", t: "Surprise discoveries at the back", d: "You only find expired stock when a customer hands it back. Bad for trust, worse for revenue." },
];

const features = [
  { i: Calendar, t: "Live expiry tracking", d: "Every batch tagged with its expiry date. Status updates automatically — Safe, Expiring, Expired." },
  { i: Bell, t: "Smart alerts that get read", d: "Prioritized warnings 7 days, 3 days, and 1 day out. No spam, no alert fatigue." },
  { i: BarChart3, t: "Single-screen dashboard", d: "KPIs, urgent items, and full inventory on one page. Made for the back-office laptop or a tablet at the till." },
  { i: Tag, t: "Category-aware", d: "Dairy, bakery, produce, pantry — each with its own thresholds and color-coded badges." },
  { i: Users, t: "Owner & staff roles", d: "Owners control products and pricing. Staff can scan, count, and update — without touching settings." },
  { i: Smartphone, t: "Works on any device", d: "Built mobile-first. Walk the aisle with a phone, manage from a desk with a monitor." },
];

const steps = [
  { n: "1", t: "Add a product", d: "Name, category, quantity, expiry date. Done in 10 seconds." },
  { n: "2", t: "Track expiry", d: "Live status — Safe, Expiring, Expired — updated automatically." },
  { n: "3", t: "Act on alerts", d: "Discount, rotate, or pull stock before it costs you a refund." },
];

const testimonials = [
  { q: "We were tossing nearly $400 of dairy a week. Two months in, that's down to under $80. It paid for itself the first weekend.", n: "Marcus Liang", r: "Owner, Liang's Corner Store" },
  { q: "My staff actually use it. The alerts don't feel like spam, and the badges make it obvious what to deal with first.", n: "Priya Shah", r: "Manager, Fresh & Quick Mart" },
  { q: "Finally something built for a corner shop, not a giant supermarket. Setup took an evening, not a quarter.", n: "Tomás Reyes", r: "Owner, Reyes Mini-Market" },
];

const plans = [
  { name: "Starter", price: "Free", per: "forever", d: "For single-location stores getting started.", f: ["Up to 100 products", "Expiry alerts", "1 staff seat", "Email support"], cta: "Start free" },
  { name: "Store", price: "$19", per: "/month", d: "Everything you need to run a tight shelf.", f: ["Unlimited products", "Smart alert priorities", "5 staff seats", "Category thresholds", "Priority support"], cta: "Start 14-day trial", popular: true },
  { name: "Multi-store", price: "$49", per: "/month", d: "For owners running 2+ locations.", f: ["Everything in Store", "Multi-location dashboard", "Unlimited seats", "Custom roles", "Phone support"], cta: "Talk to us" },
];

const faqs = [
  { q: "Do I need any special hardware?", a: "No. A laptop, tablet, or phone with a browser is all you need. If you have a barcode scanner that types into a text field (most do), it works out of the box." },
  { q: "Will it work with my existing POS?", a: "Expiry Manager Pro runs alongside any POS. We focus only on expiry and shelf-life — your POS keeps doing what it does best." },
  { q: "How long does setup take?", a: "Most owners are tracking their first 50 products within an hour. There's nothing to install — sign up and start adding stock." },
  { q: "Can my staff use it without giving them admin access?", a: "Yes. Staff accounts can log products and update counts but can't change pricing or delete items. Owner accounts control everything." },
  { q: "Is my data safe?", a: "Your inventory data is yours. We use encrypted authentication, role-based access, and you can export everything as CSV at any time." },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="container pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/60 border border-border px-4 py-1.5 text-xs text-muted-foreground mb-8 animate-fade-up">
          <span className="status-dot bg-success animate-pulse-glow" />
          Built for small grocery & convenience stores
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] text-gradient animate-fade-up" style={{ animationDelay: "100ms" }}>
          Stop throwing<br />money in the bin.
        </h1>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
          The simplest way for independent stores to track expiry dates, get smart alerts, and cut shelf-loss by up to 30% — without spreadsheets.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <Button asChild variant="hero" size="lg" className="rounded-full px-7">
            <Link to="/auth?mode=signup">Start free <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="rounded-full px-7 border border-border">
            <a href="#pricing">See pricing</a>
          </Button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">No credit card required · Free forever for 1 store</p>

        {/* Stats strip */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-border/60 py-10">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl md:text-5xl font-bold text-gradient">{s.v}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="container py-20">
        <p className="text-center text-xs uppercase tracking-widest text-accent font-semibold">The problem</p>
        <h2 className="mt-3 text-center font-display text-4xl md:text-5xl font-bold text-gradient max-w-3xl mx-auto">
          Every corner shop loses thousands a year to expired stock.
        </h2>
        <p className="mt-4 text-center text-muted-foreground">And nobody notices until it's too late.</p>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.t} className="glass-card rounded-2xl p-7">
              <div className="text-4xl mb-4">{p.e}</div>
              <h3 className="font-display font-semibold text-xl">{p.t}</h3>
              <p className="mt-3 text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <p className="text-center text-xs uppercase tracking-widest text-accent font-semibold">Features</p>
        <h2 className="mt-3 text-center font-display text-4xl md:text-5xl font-bold text-gradient">
          Everything you need. Nothing you don't.
        </h2>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.t} className="glass-card rounded-2xl p-7 hover:-translate-y-1 transition-transform">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
                <f.i className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display font-semibold text-xl">{f.t}</h3>
              <p className="mt-2 text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container py-20">
        <p className="text-center text-xs uppercase tracking-widest text-accent font-semibold">How it works</p>
        <h2 className="mt-3 text-center font-display text-4xl md:text-5xl font-bold text-gradient">
          From shelf chaos to clarity in 3 steps.
        </h2>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="glass-card rounded-2xl p-8">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-pill shadow-pill font-display font-bold text-accent">
                {s.n}
              </div>
              <h3 className="mt-5 font-display font-semibold text-xl">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-20">
        <p className="text-center text-xs uppercase tracking-widest text-accent font-semibold">Loved by store owners</p>
        <h2 className="mt-3 text-center font-display text-4xl md:text-5xl font-bold text-gradient">
          Real shops. Real savings.
        </h2>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure key={t.n} className="glass-card rounded-2xl p-7">
              <div className="text-accent text-3xl leading-none">"</div>
              <blockquote className="mt-2 text-foreground/90">{t.q}</blockquote>
              <figcaption className="mt-5 text-sm">
                <div className="font-semibold">{t.n}</div>
                <div className="text-muted-foreground">{t.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container py-20">
        <p className="text-center text-xs uppercase tracking-widest text-accent font-semibold">Pricing</p>
        <h2 className="mt-3 text-center font-display text-4xl md:text-5xl font-bold text-gradient">
          Simple pricing for real shops.
        </h2>
        <p className="mt-4 text-center text-muted-foreground">Start free. Upgrade when you outgrow it.</p>
        <div className="mt-14 grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => (
            <div key={p.name} className={`relative glass-card rounded-2xl p-8 flex flex-col ${p.popular ? "ring-2 ring-accent shadow-glow" : ""}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1">
                  Most popular
                </span>
              )}
              <h3 className="font-display font-semibold text-xl">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className="text-muted-foreground mb-2">{p.per}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {p.f.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5" /> {feat}
                  </li>
                ))}
              </ul>
              <Button asChild variant={p.popular ? "accent" : "hero"} className="mt-8 rounded-full">
                <Link to="/auth?mode=signup">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container py-20 max-w-3xl">
        <p className="text-center text-xs uppercase tracking-widest text-accent font-semibold">FAQ</p>
        <h2 className="mt-3 text-center font-display text-4xl md:text-5xl font-bold text-gradient">Common questions.</h2>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left font-display text-lg hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="container py-20">
        <div className="glass-card rounded-3xl p-12 text-center shadow-glow">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient">
            Your shelf called. It wants to stop bleeding cash.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Sign up free, add your first 10 products, and see your first alerts within the hour.
          </p>
          <Button asChild variant="accent" size="lg" className="mt-8 rounded-full px-8">
            <Link to="/auth?mode=signup">Start free <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

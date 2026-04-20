// Frontend-only in-memory store with localStorage persistence and pub/sub.
// Replaces previous backend (Supabase) for a demo-only experience.

export type Category = { id: string; name: string; color: string; warn_days: number };
export type Supplier = { id: string; name: string; contact_email: string | null; phone: string | null; notes: string | null };
export type Batch = { id: string; product_id: string; quantity: number; expiry_date: string; received_at: string };
export type Product = {
  id: string;
  name: string;
  sku: string | null;
  category_id: string | null;
  supplier_id: string | null;
  unit_price: number;
  low_stock_threshold: number;
  created_at: string;
};
export type Profile = { display_name: string; store_name: string; email: string };

type State = {
  profile: Profile;
  categories: Category[];
  suppliers: Supplier[];
  products: Product[];
  batches: Batch[];
};

const KEY = "expiry-demo-store-v1";
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

const seed = (): State => {
  const dairy: Category = { id: uid(), name: "Dairy", color: "#60a5fa", warn_days: 5 };
  const bakery: Category = { id: uid(), name: "Bakery", color: "#f59e0b", warn_days: 3 };
  const produce: Category = { id: uid(), name: "Produce", color: "#34d399", warn_days: 4 };
  const acme: Supplier = { id: uid(), name: "Acme Distributors", contact_email: "orders@acme.test", phone: "+1 555 0100", notes: "Weekly deliveries" };
  const sun: Supplier = { id: uid(), name: "Sunrise Bakery Co.", contact_email: "hello@sunrise.test", phone: null, notes: null };

  const milk: Product = { id: uid(), name: "Whole Milk 1L", sku: "MLK-001", category_id: dairy.id, supplier_id: acme.id, unit_price: 2.49, low_stock_threshold: 6, created_at: new Date().toISOString() };
  const yogurt: Product = { id: uid(), name: "Greek Yogurt 500g", sku: "YGT-500", category_id: dairy.id, supplier_id: acme.id, unit_price: 3.99, low_stock_threshold: 4, created_at: new Date().toISOString() };
  const bread: Product = { id: uid(), name: "Sourdough Loaf", sku: "BRD-SD", category_id: bakery.id, supplier_id: sun.id, unit_price: 4.5, low_stock_threshold: 3, created_at: new Date().toISOString() };
  const apples: Product = { id: uid(), name: "Gala Apples (kg)", sku: "APL-G", category_id: produce.id, supplier_id: acme.id, unit_price: 2.99, low_stock_threshold: 10, created_at: new Date().toISOString() };

  const batches: Batch[] = [
    { id: uid(), product_id: milk.id, quantity: 8, expiry_date: inDays(2), received_at: today() },
    { id: uid(), product_id: milk.id, quantity: 12, expiry_date: inDays(9), received_at: today() },
    { id: uid(), product_id: yogurt.id, quantity: 3, expiry_date: inDays(-1), received_at: today() },
    { id: uid(), product_id: bread.id, quantity: 5, expiry_date: inDays(1), received_at: today() },
    { id: uid(), product_id: apples.id, quantity: 20, expiry_date: inDays(6), received_at: today() },
  ];

  return {
    profile: { display_name: "Demo User", store_name: "My Demo Store", email: "demo@example.com" },
    categories: [dairy, bakery, produce],
    suppliers: [acme, sun],
    products: [milk, yogurt, bread, apples],
    batches,
  };
};

const load = (): State => {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {}
  const s = seed();
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  return s;
};

let state: State = load();
const listeners = new Set<() => void>();
const persist = () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
};

export const store = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  getState() { return state; },
  reset() { state = seed(); persist(); },

  // Profile
  updateProfile(p: Partial<Profile>) { state = { ...state, profile: { ...state.profile, ...p } }; persist(); },

  // Categories
  addCategory(c: Omit<Category, "id">) { state = { ...state, categories: [...state.categories, { ...c, id: uid() }] }; persist(); },
  deleteCategory(id: string) {
    state = {
      ...state,
      categories: state.categories.filter((c) => c.id !== id),
      products: state.products.map((p) => (p.category_id === id ? { ...p, category_id: null } : p)),
    };
    persist();
  },

  // Suppliers
  addSupplier(s: Omit<Supplier, "id">) { state = { ...state, suppliers: [...state.suppliers, { ...s, id: uid() }] }; persist(); },
  deleteSupplier(id: string) {
    state = {
      ...state,
      suppliers: state.suppliers.filter((s) => s.id !== id),
      products: state.products.map((p) => (p.supplier_id === id ? { ...p, supplier_id: null } : p)),
    };
    persist();
  },

  // Products
  addProduct(p: Omit<Product, "id" | "created_at">) {
    state = { ...state, products: [{ ...p, id: uid(), created_at: new Date().toISOString() }, ...state.products] };
    persist();
  },
  deleteProduct(id: string) {
    state = {
      ...state,
      products: state.products.filter((p) => p.id !== id),
      batches: state.batches.filter((b) => b.product_id !== id),
    };
    persist();
  },

  // Batches
  addBatch(b: Omit<Batch, "id" | "received_at">) {
    state = { ...state, batches: [...state.batches, { ...b, id: uid(), received_at: today() }] };
    persist();
  },
  deleteBatch(id: string) { state = { ...state, batches: state.batches.filter((b) => b.id !== id) }; persist(); },
};

import { useSyncExternalStore } from "react";
export const useStore = <T,>(selector: (s: State) => T): T =>
  useSyncExternalStore(store.subscribe, () => selector(store.getState()), () => selector(store.getState()));

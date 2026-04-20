// React Query hooks backed by Lovable Cloud (Supabase). RLS scopes everything per user.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Category = { id: string; name: string; color: string; warn_days: number };
export type Supplier = { id: string; name: string; contact_email: string | null; phone: string | null; notes: string | null };
export type Batch = { id: string; product_id: string; quantity: number; expiry_date: string; received_at: string };
export type Product = {
  id: string; name: string; sku: string | null; category_id: string | null; supplier_id: string | null;
  unit_price: number; low_stock_threshold: number; created_at: string;
};
export type Profile = { display_name: string | null; store_name: string | null };

const KEYS = {
  categories: ["categories"] as const,
  suppliers: ["suppliers"] as const,
  products: ["products"] as const,
  batches: ["batches"] as const,
  profile: ["profile"] as const,
};

export const useCategories = () =>
  useQuery({
    queryKey: KEYS.categories,
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase.from("categories").select("id,name,color,warn_days").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

export const useSuppliers = () =>
  useQuery({
    queryKey: KEYS.suppliers,
    queryFn: async (): Promise<Supplier[]> => {
      const { data, error } = await supabase.from("suppliers").select("id,name,contact_email,phone,notes").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

export const useProducts = () =>
  useQuery({
    queryKey: KEYS.products,
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,sku,category_id,supplier_id,unit_price,low_stock_threshold,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((p) => ({ ...p, unit_price: Number(p.unit_price) }));
    },
  });

export const useBatches = () =>
  useQuery({
    queryKey: KEYS.batches,
    queryFn: async (): Promise<Batch[]> => {
      const { data, error } = await supabase.from("batches").select("id,product_id,quantity,expiry_date,received_at");
      if (error) throw error;
      return data ?? [];
    },
  });

export const useProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: KEYS.profile,
    enabled: !!user,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase.from("profiles").select("display_name,store_name").eq("user_id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

// Mutations
export const useAddCategory = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (c: Omit<Category, "id">) => {
      const { error } = await supabase.from("categories").insert({ ...c, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.categories }),
  });
};
export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEYS.categories }); qc.invalidateQueries({ queryKey: KEYS.products }); },
  });
};

export const useAddSupplier = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (s: Omit<Supplier, "id">) => {
      const { error } = await supabase.from("suppliers").insert({ ...s, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.suppliers }),
  });
};
export const useDeleteSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("suppliers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEYS.suppliers }); qc.invalidateQueries({ queryKey: KEYS.products }); },
  });
};

export const useAddProduct = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (p: Omit<Product, "id" | "created_at">) => {
      const { error } = await supabase.from("products").insert({ ...p, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.products }),
  });
};
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEYS.products }); qc.invalidateQueries({ queryKey: KEYS.batches }); },
  });
};

export const useAddBatch = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (b: Omit<Batch, "id" | "received_at">) => {
      const { error } = await supabase.from("batches").insert({ ...b, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.batches }),
  });
};
export const useDeleteBatch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("batches").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.batches }),
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (p: Partial<Profile>) => {
      const { error } = await supabase.from("profiles").update(p).eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.profile }),
  });
};

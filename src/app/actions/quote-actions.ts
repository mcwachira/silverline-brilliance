// actions/quote-actions.ts
"use server";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { QuoteRequestStatus } from "@/types/types";
import type { ActionResult } from "@/types/admin";
import type { Database } from "@/src/lib/supabase/database.types";

type QuoteRequest = Database['public']['Tables']['quote_requests']['Row'];

// ── Fetch all quotes ─────────────────────────────────────────────

export async function getQuotes(): Promise<ActionResult<QuoteRequest[]>> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as QuoteRequest[] };
}

// ── Fetch single quote ───────────────────────────────────────────

export async function getQuote(id: string): Promise<ActionResult<QuoteRequest>> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as QuoteRequest };
}

// ── Update quote status ──────────────────────────────────────────

export async function updateQuoteStatus(
  id: string,
  status: QuoteRequestStatus
): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const { error } = await supabase
    .from("quote_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/quotes/${id}`);
  return { success: true };
}

// ── Delete quote ─────────────────────────────────────────────────

export async function deleteQuote(id: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const { error } = await supabase
    .from("quote_requests")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/quotes");
  return { success: true };
}

// ── Compute totals helper (used before insert/update) ───────────

export async function computeQuoteTotals(
  lineItems: Array<{ quantity: number; unitPrice: number }>,
  discount: number,
  tax: number
) {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const discount_amount = (subtotal * discount) / 100;
  const taxable = subtotal - discount_amount;
  const tax_amount = (taxable * tax) / 100;
  const total = taxable + tax_amount;
  return { subtotal, discount_amount, tax_amount, total };
}
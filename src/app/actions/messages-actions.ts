// actions/messages-actions.ts
"use server";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ContactMessage, MessageStatus } from "@/types/messages";
import type { ActionResult } from "@/types/admin";

// ── Fetch messages ─────────────────────────────────────────────────
// Called server-side for initial load. Client re-fetches via Supabase realtime.

export async function getMessages(filter?: {
  status?: MessageStatus;
  search?: string;
}): Promise<ActionResult<ContactMessage[]>> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  let query = supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter?.status) {
    query = query.eq("status", filter.status);
  }

  if (filter?.search) {
    const q = filter.search;
    query = query.or(
      `full_name.ilike.%${q}%,email.ilike.%${q}%,subject.ilike.%${q}%,reference.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  if (error) return { success: false, error: error.message };
  return { success: true, data: data as ContactMessage[] };
}

// ── Get unread count (used by nav shell) ──────────────────────────

export async function getUnreadCount(): Promise<number> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "unread");

  return count ?? 0;
}

// ── Update message status ─────────────────────────────────────────

export async function updateMessageStatus(
  messageId: string,
  status: MessageStatus
): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (status === "replied") {
    updates.replied_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("contact_messages")
    .update(updates)
    .eq("id", messageId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/messages");
  return { success: true };
}

// ── Save admin notes ──────────────────────────────────────────────

export async function saveMessageNotes(
  messageId: string,
  adminNotes: string
): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const { error } = await supabase
    .from("contact_messages")
    .update({
      admin_notes: adminNotes.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", messageId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/messages");
  return { success: true };
}

// ── Delete message ────────────────────────────────────────────────

export async function deleteMessage(messageId: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", messageId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/messages");
  return { success: true };
}

// ── Mark as read on open ──────────────────────────────────────────

export async function markAsRead(messageId: string): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const { error } = await supabase
    .from("contact_messages")
    .update({ status: "read", updated_at: new Date().toISOString() })
    .eq("id", messageId)
    .eq("status", "unread"); // only update if still unread

  if (error) return { success: false, error: error.message };
  return { success: true };
}
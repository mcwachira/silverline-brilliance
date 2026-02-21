
"use server";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { DashboardStats, ActivityItem, ActionResult } from "@/types/admin";

// ── Dashboard stats ───────────────────────────────────────────────

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const now      = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Run all counts in parallel
  const [
    bookingsAll,
    bookingsMonth,
    bookingsPending,
    bookingsConfirmed,
    quotesAll,
    quotesAccepted,
    posts,
    messages,
  ] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("quotes").select("id", { count: "exact", head: true }),
    supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "accepted"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "unread"),
  ]);

  // Accepted quotes value
  const { data: acceptedQuotes } = await supabase
    .from("quotes")
    .select("total")
    .eq("status", "accepted");

  const total_quote_value = (acceptedQuotes ?? []).reduce(
    (sum: number, q: { total: number }) => sum + (q.total ?? 0),
    0
  );

  const stats: DashboardStats = {
    total_bookings:      bookingsAll.count        ?? 0,
    bookings_this_month: bookingsMonth.count      ?? 0,
    pending_bookings:    bookingsPending.count     ?? 0,
    confirmed_bookings:  bookingsConfirmed.count  ?? 0,
    total_quotes:        quotesAll.count          ?? 0,
    accepted_quotes:     quotesAccepted.count     ?? 0,
    total_quote_value,
    published_posts:     posts.count              ?? 0,
    unread_messages:     messages.count           ?? 0,
  };

  return { success: true, data: stats };
}

// ── Activity feed ─────────────────────────────────────────────────
// Combines recent rows from bookings, quotes, messages, blog into a
// single chronological timeline (most recent 20 events).

export async function getActivityFeed(): Promise<ActionResult<ActivityItem[]>> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" };

  const [bookings, quotes, messages, posts] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, reference, client_name, event_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("quotes")
      .select("id, quote_number, client_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("contact_messages")
      .select("id, reference, full_name, subject, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("blog_posts")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const items: ActivityItem[] = [
    ...(bookings.data ?? []).map((b) => ({
      id:         `booking-${b.id}`,
      type:       "booking" as const,
      action:     b.status === "pending" ? "New booking request" : `Booking ${b.status}`,
      subject:    `${b.client_name} — ${b.event_name}`,
      status:     b.status,
      created_at: b.created_at,
    })),
    ...(quotes.data ?? []).map((q) => ({
      id:         `quote-${q.id}`,
      type:       "quote" as const,
      action:     q.status === "draft" ? "Quote created" : `Quote ${q.status}`,
      subject:    `${q.quote_number} — ${q.client_name}`,
      status:     q.status,
      created_at: q.created_at,
    })),
    ...(messages.data ?? []).map((m) => ({
      id:         `message-${m.id}`,
      type:       "message" as const,
      action:     "New contact message",
      subject:    `${m.full_name} — ${m.subject}`,
      status:     m.status,
      created_at: m.created_at,
    })),
    ...(posts.data ?? []).map((p) => ({
      id:         `blog-${p.id}`,
      type:       "blog" as const,
      action:     p.status === "published" ? "Post published" : "Post created",
      subject:    p.title,
      status:     p.status,
      created_at: p.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20);

  return { success: true, data: items };
}

// ── Recent bookings (for dashboard widget) ────────────────────────

export async function getRecentBookings() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" as string, data: undefined };

  const { data, error } = await supabase
    .from("bookings")
    .select("id, reference, client_name, event_name, event_date, services, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) return { success: false, error: error.message, data: undefined };
  return { success: true, data };
}

// ── Recent quotes (for dashboard widget) ─────────────────────────

export async function getRecentQuotes() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorised" as string, data: undefined };

  const { data, error } = await supabase
    .from("quotes")
    .select("id, quote_number, client_name, client_company, total, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) return { success: false, error: error.message, data: undefined };
  return { success: true, data };
}
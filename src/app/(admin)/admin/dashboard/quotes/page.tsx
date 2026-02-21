// app/(admin)/dashboard/quotes/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { getQuotes } from "@/src/app/actions/quote-actions";
import { PageHeader } from "@/src/components/admin/shared/PageHeader";
import { QuotesTable } from "@/src/components/admin/quotes/QuotesTable";
import { Button } from "@/src/components/ui/button";
import { FilePlus } from "lucide-react";

export const metadata = { title: "Quotes — Silverline Admin" };

export default async function QuotesPage() {
  // Auth guard
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Data
  const result = await getQuotes();
  const quotes = result.success ? (result.data ?? []) : [];

  // Totals for header summary chips
  const totalValue = quotes.reduce((s, q) => s + q.total, 0);
  const pending    = quotes.filter(q => q.status === "sent").length;
  const accepted   = quotes.filter(q => q.status === "accepted").length;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">

      {/* ── Page header ─────────────────── */}
      <PageHeader
        title="Quotes"
        subtitle={`${quotes.length} total · $${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })} total value`}
      >
        <Button asChild className="btn-primary gap-2">
          <Link href="/dashboard/quotes/generate">
            <FilePlus className="w-4 h-4" />
            Generate Quote
          </Link>
        </Button>
      </PageHeader>

      {/* ── Summary cards ───────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Quotes",  value: quotes.length,  color: "text-[var(--text)]",        bg: "bg-white/4" },
          { label: "Awaiting Reply",value: pending,         color: "text-[var(--info)]",         bg: "bg-[var(--info)]/8" },
          { label: "Accepted",      value: accepted,        color: "text-[var(--success)]",      bg: "bg-[var(--success)]/8" },
          { label: "Total Value",   value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                                                            color: "text-[var(--accent)]",       bg: "bg-[var(--accent)]/8" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className={`stat-card rounded-xl p-4 ${bg} border border-white/8`}
          >
            <p className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-wider mb-2">
              {label}
            </p>
            <p className={`text-xl font-bold font-[family-name:var(--font-playfair)] ${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Error state ─────────────────── */}
      {!result.success && (
        <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/8 p-4 text-sm text-[var(--destructive)]">
          ⚠️ Failed to load quotes: {result.error}
        </div>
      )}

      {/* ── Table ───────────────────────── */}
      <QuotesTable quotes={quotes} />
    </div>
  );
}
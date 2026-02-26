// app/(admin)/dashboard/quotes/[id]/page.tsx

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { getQuote } from "@/src/app/actions/quote-actions";
import { PageHeader } from "@/src/components/admin/shared/PageHeader";
import { StatusBadge } from "@/src/components/admin/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "View Quote — Silverline Admin" };

interface Props {
  params: { id: string };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function ViewQuotePage({ params }: Props) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = await getQuote(params.id);
  if (!result.success || !result.data) notFound();
  const q = result.data;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* ── Header ──────────────────────── */}
      <PageHeader
        title={q.reference}
        subtitle={`Created ${fmtDate(q.created_at)}`}
      >
        <Button asChild variant="ghost" className="btn-ghost gap-2">
          <Link href="/dashboard/quotes">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </Button>
        <StatusBadge status={q.status} />
      </PageHeader>

      {/* ── Meta grid ───────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Client",     value: q.name },
          { label: "Email",      value: q.email },
          { label: "Phone",      value: q.phone },
          { label: "Service",    value: q.service || "—" },
        ].map(({ label, value }) => (
          <div key={label} className="card rounded-xl p-4 bg-white/[0.02]">
            <p className="label mb-1">{label}</p>
            <p className="text-sm font-semibold text-[var(--text)]">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Message ─────────────────────── */}
      <div className="card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text)]">Request Details</h3>
        </div>
        <div className="p-5">
          <div className="space-y-3">
            {q.event_date && (
              <div>
                <p className="text-xs text-[var(--muted)] mb-1">Event Date</p>
                <p className="text-sm text-[var(--text)]">{fmtDate(q.event_date)}</p>
              </div>
            )}
            {q.message && (
              <div>
                <p className="text-xs text-[var(--muted)] mb-1">Message</p>
                <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{q.message}</p>
              </div>
            )}
            {!q.event_date && !q.message && (
              <p className="text-sm text-[var(--muted)] italic">No additional details provided</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// app/(admin)/dashboard/quotes/[id]/page.tsx

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { getQuote } from "@/src/app/actions/quote-actions";
import { PageHeader } from "@/src/components/admin/shared/PageHeader";
import { StatusBadge } from "@/src/components/admin/shared/StatusBadge";
import { QuotePDFButton } from "@/src/components/admin/quotes/QuotePDFButton";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "View Quote — Silverline Admin" };

interface Props {
  params: { id: string };
}

function fmt(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        title={q.quote_number}
        subtitle={`Created ${fmtDate(q.created_at)}`}
      >
        <Button asChild variant="ghost" className="btn-ghost gap-2">
          <Link href="/dashboard/quotes">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </Button>
        <StatusBadge status={q.status} />
        <QuotePDFButton quote={q} />
      </PageHeader>

      {/* ── Meta grid ───────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Client",     value: q.client_name },
          { label: "Company",    value: q.client_company || "—" },
          { label: "Issue Date", value: fmtDate(q.issue_date) },
          { label: "Valid Until",value: q.valid_until ? fmtDate(q.valid_until) : "—" },
        ].map(({ label, value }) => (
          <div key={label} className="card rounded-xl p-4 bg-white/[0.02]">
            <p className="label mb-1">{label}</p>
            <p className="text-sm font-semibold text-[var(--text)]">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Line items ──────────────────── */}
      <div className="card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text)]">Services & Pricing</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["Description", "Qty", "Unit Price", "Total"].map((h) => (
                  <th key={h} className={h !== "Description" ? "text-right" : ""}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {q.line_items.map((item) => (
                <tr key={item.id} className="border-b border-white/[0.03] hover:bg-primary/[0.03] transition-colors">
                  <td className="font-medium text-[var(--text)]">{item.description}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{fmt(item.unitPrice)}</td>
                  <td className="text-right font-semibold text-[var(--text)]">{fmt(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-5 py-4 border-t border-[var(--border)] space-y-2">
          <div className="flex justify-end gap-8 text-sm">
            <span className="text-[var(--text-muted)]">Subtotal</span>
            <span className="text-[var(--text)] w-28 text-right">{fmt(q.subtotal)}</span>
          </div>
          {q.discount > 0 && (
            <div className="flex justify-end gap-8 text-sm">
              <span className="text-[var(--text-muted)]">Discount ({q.discount}%)</span>
              <span className="text-[var(--success)] w-28 text-right">-{fmt(q.discount_amount)}</span>
            </div>
          )}
          {q.tax > 0 && (
            <div className="flex justify-end gap-8 text-sm">
              <span className="text-[var(--text-muted)]">Tax ({q.tax}%)</span>
              <span className="text-[var(--text-muted)] w-28 text-right">{fmt(q.tax_amount)}</span>
            </div>
          )}
          <div className="flex justify-end gap-8 pt-2 border-t border-[var(--border)]">
            <span className="text-sm font-bold text-[var(--text)]">Total</span>
            <span className="text-lg font-bold text-[var(--accent)] w-28 text-right">{fmt(q.total)}</span>
          </div>
        </div>
      </div>

      {/* ── Notes ───────────────────────── */}
      {(q.notes || q.payment_terms) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {q.notes && (
            <div className="card rounded-xl p-5">
              <p className="label mb-2">Notes & Terms</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">{q.notes}</p>
            </div>
          )}
          {q.payment_terms && (
            <div className="card rounded-xl p-5">
              <p className="label mb-2">Payment Terms</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">{q.payment_terms}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
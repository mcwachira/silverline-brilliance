// components/admin/quotes/QuotesTable.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Eye, MoreHorizontal, Trash2, Download, Search, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/src/components/admin/shared/StatusBadge";
import { EmptyState } from "@/src/components/admin/shared/EmptyState";
import { deleteQuote } from "@/src/app/actions/quote-actions";
import type { QuoteRequest, QuoteRequestStatus } from "@/src/app/actions/quote-actions";

// ── Status filter tabs ────────────────────────────────────────────

const STATUS_TABS: { label: string; value: QuoteRequestStatus | "all" }[] = [
  { label: "All",       value: "all" },
  { label: "New",       value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Converted",  value: "converted" },
  { label: "Closed",     value: "closed" },
];

// ── Helpers ───────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── Component ─────────────────────────────────────────────────────

interface QuotesTableProps {
  quotes: QuoteRequest[];
}

export function QuotesTable({ quotes }: QuotesTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<QuoteRequestStatus | "all">("all");

  // Filter
  const filtered = quotes.filter((q) => {
    const matchesTab  = activeTab === "all" || q.status === activeTab;
    const matchesSearch =
      !search ||
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.reference.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase()) ||
      (q.service ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  async function handleDelete(id: string, ref: string) {
    if (!confirm(`Delete quote ${ref}? This cannot be undone.`)) return;

    startTransition(async () => {
      const result = await deleteQuote(id);
      if (result.success) {
        toast.success("Quote deleted");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to delete");
      }
    });
  }

  async function handleDownload(quote: Quote) {
    try {
      const { downloadQuotePDF } = await import("@/src/lib/pdf/quote-pdf");
      await downloadQuotePDF(quote);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Failed to generate PDF");
    }
  }

  // Tab counts
  const counts = STATUS_TABS.reduce<Record<string, number>>((acc, t) => {
    acc[t.value] = t.value === "all"
      ? quotes.length
      : quotes.filter(q => q.status === t.value).length;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* ── Status tabs ──────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={[
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "bg-white/5 text-[var(--text-muted)] border border-white/10 hover:border-white/20 hover:text-[var(--text)]",
              ].join(" ")}
            >
              {tab.label}
              {counts[tab.value] > 0 && (
                <span className={[
                  "text-[10px] font-bold rounded-full px-1.5 min-w-[18px] text-center",
                  isActive ? "bg-black/15" : "bg-white/8",
                ].join(" ")}>
                  {counts[tab.value]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Search ───────────────────────────── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" />
        <Input
          placeholder="Search client, reference…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
        />
      </div>

      {/* ── Table ────────────────────────────── */}
      <div className="card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
              {["Reference", "Client", "Email", "Service", "Date", "Status", ""].map((h) => (
                <TableHead
                  key={h}
                  className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="p-0">
                  <EmptyState
                    icon={Search}
                    title={search ? "No quotes match your search" : "No quotes yet"}
                    description={search
                      ? "Try adjusting your search terms"
                      : "Generate your first quote using the Quote Generator above."}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((quote) => (
                <TableRow
                  key={quote.id}
                  className="border-b border-white/[0.04] hover:bg-primary/[0.04] cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/quotes/${quote.id}`)}
                >
                  {/* Reference */}
                  <TableCell className="px-4 py-3.5">
                    <span className="font-mono text-xs font-semibold text-[var(--text)]">
                      {quote.reference}
                    </span>
                  </TableCell>

                  {/* Client */}
                  <TableCell className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-[var(--text)] leading-tight">
                      {quote.name}
                    </p>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="px-4 py-3.5">
                    <p className="text-sm text-[var(--text)]">
                      {quote.email}
                    </p>
                  </TableCell>

                  {/* Service */}
                  <TableCell className="px-4 py-3.5">
                    <p className="text-sm text-[var(--text)]">
                      {quote.service || "—"}
                    </p>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="px-4 py-3.5">
                    <p className="text-sm text-[var(--text)]">
                      {fmtDate(quote.created_at)}
                    </p>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-3.5">
                    <StatusBadge status={quote.status} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="btn-ghost w-8 h-8">
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 card border-[var(--border)]"
                      >
                        <DropdownMenuItem
                          className="gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                          onClick={() => router.push(`/dashboard/quotes/${quote.id}`)}
                        >
                          <Eye className="w-3.5 h-3.5" /> View Quote
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                          onClick={() => handleDownload(quote)}
                        >
                          <Download className="w-3.5 h-3.5" /> Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[var(--border)]" />
                        <DropdownMenuItem
                          className="gap-2 text-sm text-[var(--destructive)] cursor-pointer"
                          onClick={() => handleDelete(quote.id, quote.reference)}
                          disabled={isPending}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-[var(--text-faint)] px-1">
          Showing {filtered.length} of {quotes.length} quotes
        </p>
      )}
    </div>
  );
}
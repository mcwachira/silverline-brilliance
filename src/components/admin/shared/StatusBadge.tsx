// components/admin/shared/StatusBadge.tsx

import { cn } from "@/src/lib/utils";
import type { QuoteStatus } from "@/types/admin";

type BadgeVariant =
  | QuoteStatus
  | "unread" | "read" | "replied" | "archived"
  | "pending" | "reviewing" | "confirmed" | "completed" | "rejected"
  | "published" | "draft" | "scheduled";

interface StatusBadgeProps {
  status: BadgeVariant;
  className?: string;
}

const config: Record<
  BadgeVariant,
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  // Quotes
  draft:     { label: "Draft",     dot: "bg-[var(--text-faint)]",   bg: "bg-[var(--text-faint)]/10",   text: "text-[var(--text-faint)]",   border: "border-[var(--text-faint)]/25" },
  sent:      { label: "Sent",      dot: "bg-[var(--info)]",         bg: "bg-[var(--info)]/10",         text: "text-[var(--info)]",         border: "border-[var(--info)]/25" },
  accepted:  { label: "Accepted",  dot: "bg-[var(--success)]",      bg: "bg-[var(--success)]/10",      text: "text-[var(--success)]",      border: "border-[var(--success)]/25" },
  rejected:  { label: "Rejected",  dot: "bg-[var(--destructive)]",  bg: "bg-[var(--destructive)]/10",  text: "text-[var(--destructive)]",  border: "border-[var(--destructive)]/25" },
  expired:   { label: "Expired",   dot: "bg-[var(--warning)]",      bg: "bg-[var(--warning)]/10",      text: "text-[var(--warning)]",      border: "border-[var(--warning)]/25" },
  // Messages
  unread:    { label: "Unread",    dot: "bg-[var(--destructive)]",  bg: "bg-[var(--destructive)]/10",  text: "text-[var(--destructive)]",  border: "border-[var(--destructive)]/25" },
  read:      { label: "Read",      dot: "bg-[var(--text-faint)]",   bg: "bg-[var(--text-faint)]/10",   text: "text-[var(--text-faint)]",   border: "border-[var(--text-faint)]/25" },
  replied:   { label: "Replied",   dot: "bg-[var(--success)]",      bg: "bg-[var(--success)]/10",      text: "text-[var(--success)]",      border: "border-[var(--success)]/25" },
  archived:  { label: "Archived",  dot: "bg-[var(--text-faint)]",   bg: "bg-[var(--text-faint)]/10",   text: "text-[var(--text-faint)]",   border: "border-[var(--text-faint)]/25" },
  // Bookings
  pending:   { label: "Pending",   dot: "bg-[var(--warning)]",      bg: "bg-[var(--warning)]/10",      text: "text-[var(--warning)]",      border: "border-[var(--warning)]/25" },
  reviewing: { label: "Reviewing", dot: "bg-[var(--info)]",         bg: "bg-[var(--info)]/10",         text: "text-[var(--info)]",         border: "border-[var(--info)]/25" },
  confirmed: { label: "Confirmed", dot: "bg-[var(--info)]",         bg: "bg-[var(--info)]/10",         text: "text-[var(--info)]",         border: "border-[var(--info)]/25" },
  completed: { label: "Completed", dot: "bg-[var(--success)]",      bg: "bg-[var(--success)]/10",      text: "text-[var(--success)]",      border: "border-[var(--success)]/25" },
  // Blog
  published: { label: "Published", dot: "bg-[var(--success)]",      bg: "bg-[var(--success)]/10",      text: "text-[var(--success)]",      border: "border-[var(--success)]/25" },
  scheduled: { label: "Scheduled", dot: "bg-[var(--warning)]",      bg: "bg-[var(--warning)]/10",      text: "text-[var(--warning)]",      border: "border-[var(--warning)]/25" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const c = config[status] ?? config.draft;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border",
      c.bg, c.text, c.border, className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", c.dot)} />
      {c.label}
    </span>
  );
}
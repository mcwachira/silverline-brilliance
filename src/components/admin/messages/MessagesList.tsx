// components/admin/messages/MessagesList.tsx
"use client";

import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import  {StatusBadge } from "@/src/components/admin/shared/StatusBadge";
import { EmptyState } from "@/src/components/admin/shared/EmptyState";
import { MessageSquare } from "lucide-react";
import type { ContactMessage, MessageCounts, MessageStatus } from "@/types/messages";

// ── Helpers ───────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);

  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function SenderAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const palette = [
    "bg-primary/20 text-primary-light",
    "bg-[var(--info)]/15 text-[var(--info)]",
    "bg-[var(--success)]/15 text-[var(--success)]",
    "bg-[var(--accent)]/15 text-[var(--accent)]",
    "bg-[var(--warning)]/15 text-[var(--warning)]",
  ];
  const idx = name.charCodeAt(0) % palette.length;
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
      text-xs font-bold ${palette[idx]}`}>
      {initials}
    </div>
  );
}

// ── Filter tabs ───────────────────────────────────────────────────

const TABS: { value: MessageStatus | "all"; label: string }[] = [
  { value: "all",      label: "All" },
  { value: "unread",   label: "Unread" },
  { value: "read",     label: "Read" },
  { value: "replied",  label: "Replied" },
  { value: "archived", label: "Archived" },
];

// ── Component ─────────────────────────────────────────────────────

interface MessagesListProps {
  messages: ContactMessage[];
  counts: MessageCounts;
  selected: ContactMessage | null;
  search: string;
  activeTab: MessageStatus | "all";
  loading: boolean;
  onSelect: (msg: ContactMessage) => void;
  onSearchChange: (v: string) => void;
  onTabChange: (v: MessageStatus | "all") => void;
  onRefresh: () => void;
}

export function MessagesList({
  messages,
  counts,
  selected,
  search,
  activeTab,
  loading,
  onSelect,
  onSearchChange,
  onTabChange,
  onRefresh,
}: MessagesListProps) {
  return (
    <div className="flex flex-col w-full md:w-[340px] lg:w-[380px] flex-shrink-0
      card rounded-xl overflow-hidden">

      {/* ── Header ──────────────────────── */}
      <div className="px-4 pt-4 pb-3 border-b border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Inbox
            {counts.unread > 0 && (
              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                bg-[var(--destructive)]/15 text-[var(--destructive)]">
                {counts.unread} new
              </span>
            )}
          </h2>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="btn-ghost p-1.5 text-[var(--text-faint)] hover:text-[var(--text)]"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5
            text-[var(--text-faint)]" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search messages…"
            className="input pl-8 h-8 text-xs"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0.5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            const count = counts[tab.value as keyof MessageCounts];
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={[
                  "flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full",
                  "text-[11px] font-semibold transition-all duration-150",
                  isActive
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "bg-white/5 text-[var(--text-faint)] hover:text-[var(--text)] border border-white/8",
                ].join(" ")}
              >
                {tab.label}
                {count > 0 && (
                  <span className={[
                    "text-[9px] font-bold rounded-full px-1 min-w-[14px] text-center",
                    isActive ? "bg-black/15" : "bg-white/8",
                  ].join(" ")}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Message rows ─────────────────── */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
        {messages.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title={search ? "No messages match your search" : "No messages"}
            description={search ? "Try different search terms." : "Messages from your contact form will appear here."}
          />
        ) : (
          messages.map((msg) => {
            const isSelected = selected?.id === msg.id;
            const isUnread   = msg.status === "unread";

            return (
              <button
                key={msg.id}
                onClick={() => onSelect(msg)}
                className={[
                  "w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all duration-150",
                  "hover:bg-primary/[0.06] border-l-2",
                  isSelected
                    ? "bg-primary/[0.08] border-l-[var(--accent)]"
                    : "border-l-transparent",
                ].join(" ")}
              >
                {/* Avatar with unread dot */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <SenderAvatar name={msg.full_name} />
                  {isUnread && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                      bg-[var(--destructive)] border-2 border-[var(--surface)]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={`text-xs font-semibold truncate ${
                      isUnread ? "text-[var(--text)]" : "text-[var(--text-muted)]"
                    }`}>
                      {msg.full_name}
                    </span>
                    <span className="text-[10px] text-[var(--text-faint)] flex-shrink-0">
                      {timeAgo(msg.created_at)}
                    </span>
                  </div>

                  <p className={`text-xs truncate mb-1 ${
                    isUnread
                      ? "text-[var(--text)] font-medium"
                      : "text-[var(--text-faint)]"
                  }`}>
                    {msg.subject}
                  </p>

                  <p className="text-[11px] text-[var(--text-faint)] truncate leading-snug">
                    {msg.message.slice(0, 60)}…
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* ── Footer count ─────────────────── */}
      {messages.length > 0 && (
        <div className="px-4 py-2.5 border-t border-[var(--border)]">
          <p className="text-[10px] text-[var(--text-faint)]">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
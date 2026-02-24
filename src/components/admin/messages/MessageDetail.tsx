// components/admin/messages/MessageDetail.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Mail, Phone, Calendar, Tag, X, Trash2, Archive,
  CheckCheck, Loader2, CheckCircle, ExternalLink,
  StickyNote, Hash,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { StatusBadge}  from "@/src/components/admin/shared/StatusBadge";

import {
  updateMessageStatus,
  saveMessageNotes,
  deleteMessage,
} from "@/src/app/actions/messages-actions";
import { toast } from "sonner";
import type { ContactMessage, MessageStatus } from "@/types/messages";

// ── Helpers ───────────────────────────────────────────────────────

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
    hour:    "2-digit",
    minute:  "2-digit",
  });
}

function MetaCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-lg
      bg-primary/[0.06] border border-primary/[0.12]">
      <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[var(--accent)]" />
      <div className="min-w-0">
        <p className="text-[10px] text-[var(--text-faint)] uppercase tracking-wide font-semibold mb-0.5">
          {label}
        </p>
        <p className="text-xs font-medium text-[var(--text)] break-words">{value}</p>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────

interface MessageDetailProps {
  message: ContactMessage;
  onClose: () => void;
  onDeleted: (id: string) => void;
  onStatusChanged: (id: string, status: MessageStatus) => void;
}

export function MessageDetail({
  message,
  onClose,
  onDeleted,
  onStatusChanged,
}: MessageDetailProps) {
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [notes, setNotes]           = useState(message.admin_notes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesPending, startNotesTx] = useTransition();

  // Sync notes if message prop changes (different message selected)
  useEffect(() => {
    setNotes(message.admin_notes ?? "");
    setNotesSaved(false);
  }, [message.id, message.admin_notes]);

  // ── Status change ────────────────────────────────────────────

  function handleStatusChange(status: MessageStatus) {
    if (status === message.status) return;
    setActiveAction(status);
    startTransition(async () => {
      const result = await updateMessageStatus(message.id, status);
      setActiveAction(null);
      if (result.success) {
        toast.success(`Marked as ${status}`);
        onStatusChanged(message.id, status);
      } else {
        toast.error(result.error ?? "Failed to update status");
      }
    });
  }

  // ── Delete ───────────────────────────────────────────────────

  function handleDelete() {
    if (!confirm(`Permanently delete this message from ${message.full_name}?`)) return;
    startTransition(async () => {
      const result = await deleteMessage(message.id);
      if (result.success) {
        toast.success("Message deleted");
        onDeleted(message.id);
      } else {
        toast.error(result.error ?? "Failed to delete");
      }
    });
  }

  // ── Notes ────────────────────────────────────────────────────

  function handleSaveNotes() {
    setNotesSaved(false);
    startNotesTx(async () => {
      const result = await saveMessageNotes(message.id, notes);
      if (result.success) {
        setNotesSaved(true);
        toast.success("Notes saved");
        setTimeout(() => setNotesSaved(false), 3000);
      } else {
        toast.error(result.error ?? "Failed to save notes");
      }
    });
  }

  // ── Derive reply mailto link ──────────────────────────────────

  const mailtoHref = `mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)} [${message.reference}]`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden card rounded-xl min-w-0">

      {/* ── Detail header ────────────────── */}
      <div className="flex items-start justify-between gap-4 px-5 py-4
        border-b border-[var(--border)] flex-shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-sm font-semibold text-[var(--text)] leading-tight
              font-[family-name:var(--font-playfair,serif)] truncate">
              {message.subject}
            </h2>
            <StatusBadge status={message.status} className="flex-shrink-0" />
          </div>
          <p className="text-[11px] text-[var(--text-faint)] font-mono">
            {message.reference}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Reply */}
          <Button
            asChild
            size="sm"
            className="btn-primary h-8 gap-1.5 text-xs"
            onClick={() => handleStatusChange("replied")}
          >
            <a href={mailtoHref} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5" />
              Reply
            </a>
          </Button>

          {/* Mark replied */}
          {message.status !== "replied" && (
            <Button
              variant="outline"
              size="sm"
              className="btn-secondary h-8 gap-1.5 text-xs hidden sm:flex"
              onClick={() => handleStatusChange("replied")}
              disabled={isPending}
            >
              {activeAction === "replied"
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <CheckCheck className="w-3.5 h-3.5" />}
              Replied
            </Button>
          )}

          {/* Archive */}
          {message.status !== "archived" && (
            <Button
              variant="ghost"
              size="icon"
              className="btn-ghost w-8 h-8 text-[var(--text-faint)]"
              onClick={() => handleStatusChange("archived")}
              disabled={isPending}
              title="Archive"
            >
              {activeAction === "archived"
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Archive className="w-3.5 h-3.5" />}
            </Button>
          )}

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="btn-ghost w-8 h-8 text-[var(--destructive)]/70 hover:text-[var(--destructive)]"
            onClick={handleDelete}
            disabled={isPending}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>

          {/* Close (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="btn-ghost w-8 h-8 text-[var(--text-faint)] md:hidden"
            onClick={onClose}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Scrollable body ──────────────── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Sender meta grid */}
        <div className="grid grid-cols-2 gap-2">
          <MetaCard
            icon={Mail}
            label="From"
            value={`${message.full_name} <${message.email}>`}
          />
          {message.phone && (
            <MetaCard icon={Phone} label="Phone" value={message.phone} />
          )}
          {message.service && (
            <MetaCard icon={Tag} label="Service" value={message.service} />
          )}
          <MetaCard
            icon={Calendar}
            label="Received"
            value={fmtDateTime(message.created_at)}
          />
          {message.how_heard && (
            <MetaCard icon={Hash} label="Found via" value={message.how_heard} />
          )}
          {message.replied_at && (
            <MetaCard
              icon={CheckCheck}
              label="Replied"
              value={fmtDateTime(message.replied_at)}
            />
          )}
        </div>

        {/* Message body */}
        <div className="rounded-xl p-4 bg-white/[0.03] border border-[var(--border)]">
          <p className="text-[10px] uppercase tracking-widest font-bold
            text-[var(--text-faint)] mb-3">
            Message
          </p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
            {message.message}
          </p>
        </div>

        {/* Status change row */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-faint)]">
            Change Status
          </p>
          <div className="flex flex-wrap gap-2">
            {(["unread", "read", "replied", "archived"] as MessageStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={message.status === s || isPending}
                className={[
                  "text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-150",
                  "border disabled:cursor-not-allowed",
                  message.status === s
                    ? "opacity-100 cursor-default"
                    : "opacity-60 hover:opacity-100 cursor-pointer",
                ].join(" ")}
              >
                <StatusBadge status={s} />
              </button>
            ))}
          </div>
        </div>

        {/* Admin notes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StickyNote className="w-3.5 h-3.5 text-[var(--warning)]" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-faint)]">
              Private Notes
            </p>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setNotesSaved(false);
            }}
            placeholder="Internal notes — not visible to the sender…"
            rows={3}
            disabled={notesPending}
            className="input resize-none text-xs leading-relaxed"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[var(--text-faint)]">
              {notes.length} characters
            </span>
            <div className="flex items-center gap-2">
              {notesSaved && !notesPending && (
                <span className="flex items-center gap-1 text-xs text-[var(--success)]">
                  <CheckCircle className="w-3 h-3" /> Saved
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                className="btn-secondary h-7 text-xs gap-1.5"
                onClick={handleSaveNotes}
                disabled={notesPending || notes === (message.admin_notes ?? "")}
              >
                {notesPending && <Loader2 className="w-3 h-3 animate-spin" />}
                {notesPending ? "Saving…" : "Save Notes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
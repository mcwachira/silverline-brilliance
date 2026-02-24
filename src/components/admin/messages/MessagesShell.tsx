// components/admin/messages/MessagesShell.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {  createClientSupabaseClient } from "@/src/lib/supabase/client";
import { toast } from "sonner";
import { markAsRead } from "@/src/app/actions/messages-actions";
import { MessagesList } from "./MessagesList";
import { MessageDetail } from "./MessageDetail";
import { MessagesEmptyDetail } from "./MessagesEmptyDetail";
import type { ContactMessage, MessageCounts, MessageStatus } from "@/types/messages";

interface MessagesShellProps {
  initialMessages: ContactMessage[];
}

// Compute counts from message array
function computeCounts(messages: ContactMessage[]): MessageCounts {
  return {
    all:      messages.length,
    unread:   messages.filter((m) => m.status === "unread").length,
    read:     messages.filter((m) => m.status === "read").length,
    replied:  messages.filter((m) => m.status === "replied").length,
    archived: messages.filter((m) => m.status === "archived").length,
  };
}

export function MessagesShell({ initialMessages }: MessagesShellProps) {
  const supabase =  createClientSupabaseClient();

  // ── State ──────────────────────────────────────────────────────

  const [messages,  setMessages]  = useState<ContactMessage[]>(initialMessages);
  const [selected,  setSelected]  = useState<ContactMessage | null>(null);
  const [search,    setSearch]    = useState("");
  const [activeTab, setActiveTab] = useState<MessageStatus | "all">("all");
  const [loading,   setLoading]   = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (activeTab !== "all") query = query.eq("status", activeTab);
      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,reference.ilike.%${search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      setMessages((data ?? []) as ContactMessage[]);
    } catch {
      toast.error("Failed to refresh messages");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  // Debounced search / tab changes
  useEffect(() => {
    const t = setTimeout(fetchMessages, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchMessages]);

  // ── Realtime subscription ──────────────────────────────────────

  useEffect(() => {
    const channel = supabase
      .channel("messages-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        () => {
          // Silently re-fetch on any change
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Only set up once — fetchMessages closure intentionally excluded

  // ── Handlers ──────────────────────────────────────────────────

  async function handleSelect(msg: ContactMessage) {
    setSelected(msg);
    // Auto-mark unread → read
    if (msg.status === "unread") {
      await markAsRead(msg.id);
      // Optimistic update in both list and selected
      setMessages((prev) =>
        prev.map((m) => m.id === msg.id ? { ...m, status: "read" } : m)
      );
      setSelected({ ...msg, status: "read" });
    }
  }

  function handleClose() {
    setSelected(null);
  }

  function handleDeleted(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelected(null);
  }

  function handleStatusChanged(id: string, status: MessageStatus) {
    setMessages((prev) =>
      prev.map((m) => m.id === id ? { ...m, status } : m)
    );
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  // ── Derived state ─────────────────────────────────────────────

  const counts = computeCounts(messages);

  // For the list pane, we show all messages (filter is server-driven by tab/search)
  // but the realtime fetch uses the current tab/search filters

  return (
    <div className={[
      "flex gap-4 overflow-hidden",
      // On mobile: if a message is selected, hide the list; show detail full screen
      selected
        ? "flex-col md:flex-row h-[calc(100vh-180px)]"
        : "flex-col md:flex-row h-[calc(100vh-180px)]",
    ].join(" ")}>

      {/* ── List pane ────────────────────── */}
      <div className={[
        "flex-shrink-0",
        // On mobile, hide list when message is selected
        selected ? "hidden md:flex" : "flex",
        "flex-col",
      ].join(" ")}
        style={{ width: "100%", maxWidth: "380px" }}
      >
        <MessagesList
          messages={messages}
          counts={counts}
          selected={selected}
          search={search}
          activeTab={activeTab}
          loading={loading}
          onSelect={handleSelect}
          onSearchChange={setSearch}
          onTabChange={setActiveTab}
          onRefresh={fetchMessages}
        />
      </div>

      {/* ── Detail pane ──────────────────── */}
      <div className={[
        "flex-1 min-w-0",
        // On mobile, show detail only when selected
        selected ? "flex" : "hidden md:flex",
      ].join(" ")}>
        {selected ? (
          <MessageDetail
            message={selected}
            onClose={handleClose}
            onDeleted={handleDeleted}
            onStatusChanged={handleStatusChanged}
          />
        ) : (
          <MessagesEmptyDetail />
        )}
      </div>
    </div>
  );
}
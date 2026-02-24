// app/(admin)/dashboard/messages/page.tsx

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { getMessages } from "@/src/app/actions/messages-actions";
import { PageHeader } from "@/src/components/admin/shared/PageHeader";
import { MessagesShell } from "@/src/components/admin/messages/MessagesShell";

export const metadata = { title: "Messages — Silverline Admin" };
export const dynamic  = "force-dynamic";

export default async function MessagesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result   = await getMessages();
  const messages = result.success ? (result.data ?? []) : [];

  const unread  = messages.filter((m) => m.status === "unread").length;
  const total   = messages.length;

  return (
    <div className="flex flex-col h-full gap-5 p-5 md:p-6 overflow-hidden">

      {/* ── Page header ─────────────────── */}
      <PageHeader
        title="Messages"
        subtitle={
          unread > 0
            ? `${unread} unread · ${total} total`
            : `${total} total · all caught up`
        }
      />

      {/* ── Shell (client — handles realtime, selection, filters) ── */}
      <MessagesShell initialMessages={messages} />
    </div>
  );
}
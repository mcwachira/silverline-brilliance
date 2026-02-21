import { redirect } from "next/navigation";
import { getAdminProfile } from "@/src/app/actions/settings-actions";
import { PageHeader } from "@/src/components/admin/shared/PageHeader";
import { SettingsTabs } from "@/src/components/admin/settings/SettingsTabs";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";


export const metadata = { title: "Settings — Silverline Admin" };

export default async function SettingsPage() {
  // Auth guard
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  // Fetch profile
  const result = await getAdminProfile();

  if (!result.success || !result.data) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/8 p-5 text-sm text-[var(--destructive)]">
          ⚠️ Failed to load profile: {result.error ?? "Unknown error"}
        </div>
      </div>
    );
  }

  const profile = result.data;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">

      {/* ── Page header ─────────────────── */}
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      {/* ── Tabs + content ──────────────── */}
      <SettingsTabs profile={profile} />

    </div>
  );
}

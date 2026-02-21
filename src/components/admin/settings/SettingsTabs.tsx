
"use client";

import { useState } from "react";
import { User, Bell, Shield } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";
import { ProfileForm } from "./ProfileForm";
import { NotificationsForm } from "./NotificationsForm";
import { SecurityForm } from "./SecurityForm";
import type { AdminProfile } from "@/types/admin";

interface SettingsTabsProps {
  profile: AdminProfile;
}

const TABS = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security",      label: "Security",      icon: Shield },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsTabs({ profile }: SettingsTabsProps) {
  const [active, setActive] = useState<TabId>("profile");

  return (
    <div className="space-y-6">
      {/* ── Tab bar ──────────────────────── */}
      <div className="flex gap-0.5 border-b border-[var(--border)]">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={[
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150",
                "border-b-2 -mb-px focus-visible:outline-none",
                isActive
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:border-white/20",
              ].join(" ")}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Profile tab ──────────────────── */}
      {active === "profile" && (
        <div className="space-y-6">
          {/* Avatar upload card */}
          <div className="card rounded-xl p-6">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-5">Profile Photo</h3>
            <AvatarUpload
              currentUrl={profile.avatar_url}
              name={profile.full_name}
            />
          </div>

          {/* Profile info card */}
          <div className="card rounded-xl p-6">
            <h3 className="text-sm font-semibold text-[var(--text)] mb-5">Profile Information</h3>
            <ProfileForm profile={profile} />
          </div>

          {/* Danger zone */}
          <div className="card rounded-xl p-6 border border-[var(--destructive)]/30">
            <h3 className="text-sm font-semibold text-[var(--destructive)] mb-2">Danger Zone</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
              Once you delete your account, all data will be permanently removed.
              This action cannot be undone.
            </p>
            <button className="btn-danger text-sm px-4 py-2 rounded-lg">
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* ── Notifications tab ────────────── */}
      {active === "notifications" && (
        <div className="card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-1">Email Notifications</h3>
          <p className="text-xs text-[var(--text-faint)] mb-6">
            Control which emails you receive from the admin dashboard.
          </p>
          <NotificationsForm settings={profile.notification_settings} />
        </div>
      )}

      {/* ── Security tab ─────────────────── */}
      {active === "security" && (
        <div className="card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-1">Change Password</h3>
          <p className="text-xs text-[var(--text-faint)] mb-6">
            Use a strong, unique password you don&apos;t use on any other site.
          </p>
          <SecurityForm />
        </div>
      )}
    </div>
  );
}
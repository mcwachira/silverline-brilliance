"use client";

import { useState, useEffect } from "react";
import { createClientSupabaseClient } from "@/src/lib/supabase/client";
import { toast } from "sonner";
import { User, Lock, Bell, Shield, Loader2, Check, Upload } from "lucide-react";

type Tab = "profile" | "notifications" | "security";

interface NotificationSettings {
  new_booking: boolean;
  booking_cancelled: boolean;
  email_digest: boolean;
}

export default function SettingsPage() {
  const supabase = createClientSupabaseClient();
  const [tab, setTab] = useState<Tab>("profile");

  // Profile state
  const [profileLoading, setProfileLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Password state
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    new_booking: true,
    booking_cancelled: true,
    email_digest: false,
  });
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      const { data } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name ?? "");
        setAvatarUrl(data.avatar_url ?? "");
        if (data.notification_settings) {
          setNotifications(data.notification_settings);
        }
      }
    }
    loadProfile();
  }, []);

  async function handleProfileSave() {
    setProfileLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Update email if changed
      if (email !== user.email) {
        const { error } = await supabase.auth.updateUser({ email });
        if (error) throw error;
        toast.success("Email update pending — check your inbox to confirm");
      }

      // Update profile record
      const { error } = await supabase
        .from("admin_profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;

      toast.success("Profile updated");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange() {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update password",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleNotificationsSave() {
    setNotifLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase
        .from("admin_profiles")
        .update({ notification_settings: notifications })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Notification preferences saved");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setNotifLoading(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: "var(--surface)" }}
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? "btn-primary" : "btn-ghost"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="card p-6 space-y-5">
          <h2
            className="text-base font-semibold"
            style={{
              fontFamily: "Playfair Display, serif",
              color: "var(--text)",
            }}
          >
            Profile Information
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--purple), var(--gold))",
                color: "#1a1225",
              }}
            >
              {fullName ? fullName[0].toUpperCase() : "A"}
            </div>
            <div>
              <button className="btn-secondary text-sm gap-2">
                <Upload className="w-3.5 h-3.5" /> Upload Avatar
              </button>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-faint)" }}
              >
                PNG, JPG up to 2MB
              </p>
            </div>
          </div>

          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
              Changing email requires verification
            </p>
          </div>

          <button
            onClick={handleProfileSave}
            disabled={profileLoading}
            className="btn-primary"
          >
            {profileLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === "notifications" && (
        <div className="card p-6 space-y-5">
          <h2
            className="text-base font-semibold"
            style={{
              fontFamily: "Playfair Display, serif",
              color: "var(--text)",
            }}
          >
            Email Notifications
          </h2>

          {[
            {
              key: "new_booking",
              label: "New Booking Received",
              description: "Get notified when a new booking is submitted",
            },
            {
              key: "booking_cancelled",
              label: "Booking Cancelled",
              description: "Alert when a booking is cancelled",
            },
            {
              key: "email_digest",
              label: "Weekly Digest",
              description: "Weekly summary of bookings and activity",
            },
          ].map(({ key, label, description }) => (
            <div
              key={key}
              className="flex items-start justify-between gap-4 py-3 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {label}
                </p>
                <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                  {description}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications[key as keyof NotificationSettings]}
                  onChange={(e) =>
                    setNotifications((n) => ({ ...n, [key]: e.target.checked }))
                  }
                />
                <div
                  className="w-10 h-6 rounded-full transition-colors peer-checked:bg-purple-600 peer-focus:ring-2"
                  style={{
                    background: notifications[key as keyof NotificationSettings]
                      ? "var(--purple)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      notifications[key as keyof NotificationSettings]
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </label>
            </div>
          ))}

          <button
            onClick={handleNotificationsSave}
            disabled={notifLoading}
            className="btn-primary"
          >
            {notifLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Save Preferences
              </>
            )}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {tab === "security" && (
        <div className="card p-6 space-y-5">
          <h2
            className="text-base font-semibold"
            style={{
              fontFamily: "Playfair Display, serif",
              color: "var(--text)",
            }}
          >
            Change Password
          </h2>

          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
            />
          </div>

          {newPassword && (
            <div className="space-y-1.5">
              {[
                {
                  test: newPassword.length >= 8,
                  label: "At least 8 characters",
                },
                {
                  test: /[A-Z]/.test(newPassword),
                  label: "Contains uppercase letter",
                },
                { test: /[0-9]/.test(newPassword), label: "Contains number" },
              ].map(({ test, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center`}
                    style={{
                      background: test
                        ? "rgba(40,167,69,0.2)"
                        : "rgba(255,255,255,0.08)",
                    }}
                  >
                    {test && (
                      <Check className="w-2 h-2" style={{ color: "#28A745" }} />
                    )}
                  </div>
                  <span
                    style={{ color: test ? "#28A745" : "var(--text-faint)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={passwordLoading || !newPassword}
            className="btn-primary"
          >
            {passwordLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Update Password
              </>
            )}
          </button>

          <div
            className="pt-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--text)" }}
            >
              Active Sessions
            </h3>
            <div
              className="rounded-lg p-3 text-sm"
              style={{
                background: "rgba(40,167,69,0.08)",
                border: "1px solid rgba(40,167,69,0.2)",
              }}
            >
              <p style={{ color: "#28A745" }}>● Current Session — Active now</p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-faint)" }}
              >
                Sign out from all devices to revoke other sessions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

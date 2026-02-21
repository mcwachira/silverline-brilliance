"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClientSupabaseClient } from "@/src/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { AdminProfile } from "@/types/types";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/dashboard/bookings", label: "Bookings", icon: CalendarDays, exact: false },
  { href: "/admin/dashboard/blog", label: "Blog", icon: FileText, exact: false },
  { href: "/admin/dashboard/settings", label: "Settings", icon: Settings, exact: false },
];

interface Props {
  children: React.ReactNode;
  user: User;
  profile: AdminProfile | null;
}

export default function DashboardShell({ children, user, profile }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/admin/login");
  }

  const displayName =
    profile?.full_name ?? user.email?.split("@")[0] ?? "Admin";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function isActive(item: (typeof NAV_ITEMS)[number]) {
    return item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href);
  }

  const currentLabel =
    NAV_ITEMS.find((n) => isActive(n))?.label ?? "Dashboard";

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out",
          "lg:relative",
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          sidebarOpen ? "w-64" : "w-[68px]",
        ].join(" ")}
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          boxShadow: "4px 0 24px oklch(0 0 0 / 0.2)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 h-16 border-b flex-shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, oklch(0.35 0.2 295), oklch(0.49 0.18 302))",
              boxShadow: "0 0 16px oklch(0.49 0.18 302 / 0.4)",
            }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: "var(--accent)" }}
            >
              A
            </span>
          </div>

          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-semibold truncate"
                style={{
                  color: "var(--text)",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Admin
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--text-faint)" }}
              >
                Dashboard
              </p>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="ml-auto btn-ghost p-1.5 hidden lg:flex flex-shrink-0"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${
                !sidebarOpen ? "rotate-180" : ""
              }`}
              style={{ color: "var(--text-faint)" }}
            />
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="ml-auto btn-ghost p-1.5 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-0.5 px-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = exact
                ? pathname === href
                : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileSidebarOpen(false)}
                  title={!sidebarOpen ? label : undefined}
                  className={`sidebar-link ${active ? "active" : ""} ${
                    !sidebarOpen ? "justify-center px-0" : ""
                  }`}
                >
                  <Icon className="flex-shrink-0 w-5 h-5" />
                  {sidebarOpen && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </div>

          {/* Section divider */}
          {sidebarOpen && (
            <div className="px-4 mt-6 mb-2">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-faint)" }}
              >
                System
              </p>
            </div>
          )}

          <div className="space-y-0.5 px-2 mt-1">
            <Link
              href="/admin/dashboard/settings"
              onClick={() => setMobileSidebarOpen(false)}
              title={!sidebarOpen ? "Settings" : undefined}
              className={`sidebar-link ${
                pathname.startsWith("/admin/dashboard/settings") ? "active" : ""
              } ${!sidebarOpen ? "justify-center px-0" : ""}`}
            />
          </div>
        </nav>

        {/* User area */}
        <div
          className="p-3 border-t flex-shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className={`flex items-center gap-2.5 p-2 rounded-xl ${
              sidebarOpen ? "" : "justify-center"
            }`}
            style={{ background: "oklch(1 0 0 / 0.03)" }}
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, oklch(0.49 0.18 302), oklch(0.88 0.17 85 / 0.8))",
                color: "oklch(0.2 0.1 295)",
                boxShadow: "0 0 12px oklch(0.88 0.17 85 / 0.2)",
              }}
            >
              {initials}
            </div>

            {sidebarOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-medium truncate leading-tight"
                    style={{ color: "var(--text)" }}
                  >
                    {displayName}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: "var(--text-faint)" }}
                  >
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="btn-ghost p-1.5 flex-shrink-0"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center gap-3 px-5 h-16 border-b flex-shrink-0"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {/* Mobile menu button */}
          <button
            className="btn-ghost p-2 lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <div className="flex-1">
            <p
              className="text-base font-semibold"
              style={{
                fontFamily: "Playfair Display, serif",
                color: "var(--text)",
              }}
            >
              {currentLabel}
            </p>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              className="btn-ghost p-2 relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification dot */}
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
                style={{
                  background: "var(--accent)",
                  borderColor: "var(--surface)",
                }}
              />
            </button>

            {/* Mobile user avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold lg:hidden"
              style={{
                background: "linear-gradient(135deg, oklch(0.49 0.18 302), oklch(0.88 0.17 85 / 0.8))",
                color: "oklch(0.2 0.1 295)",
              }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main
          className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8"
          style={{ background: "var(--background)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
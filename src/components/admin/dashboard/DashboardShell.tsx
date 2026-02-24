// components/admin/DashboardShell.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClientSupabaseClient } from "@/src/lib/supabase/client";
import {
  LayoutDashboard, CalendarDays, FileText, Settings,
  LogOut, Menu, ChevronLeft, FileSpreadsheet,
  MessageSquare, BookOpen, X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { AdminProfile } from "@/types/admin";

// ── Nav structure ─────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      {
        href:  "/admin/dashboard",
        label: "Overview",
        icon:  LayoutDashboard,
        exact: true,
      },
      {
        href:  "/admin/dashboard/bookings",
        label: "Bookings",
        icon:  CalendarDays,
        badgeKey: "bookings" as const,
      },
      {
        href:  "/admin/dashboard/quotes",
        label: "Quotes",
        icon:  FileSpreadsheet,
      },
      {
        href:  "/admin/dashboard/messages",
        label: "Messages",
        icon:  MessageSquare,
        badgeKey: "messages" as const,
      },
      {
        href:  "/admin/dashboard/blog",
        label: "Blog",
        icon:  BookOpen,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        href:  "/admin/dashboard/settings",
        label: "Settings",
        icon:  Settings,
      },
    ],
  },
];

// ── Props ─────────────────────────────────────────────────────────

interface DashboardShellProps {
  children: React.ReactNode;
  user: User;
  profile: AdminProfile | null;
  unreadMessages: number;
  pendingBookings: number;
}

// ── Avatar fallback ───────────────────────────────────────────────

function UserAvatar({
  src,
  name,
  collapsed,
}: {
  src: string | null;
  name: string;
  collapsed: boolean;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center
        font-bold text-xs transition-all duration-300
        ${collapsed ? "w-8 h-8" : "w-9 h-9"}`}
      style={{
        background: src
          ? "transparent"
          : "linear-gradient(135deg, var(--primary), var(--accent))",
        color: "#1a1225",
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={36}
          height={36}
          className="object-cover w-full h-full"
          unoptimized
        />
      ) : (
        initials
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export default function DashboardShell({
  children,
  user,
  profile,
  unreadMessages,
  pendingBookings,
}: DashboardShellProps) {
  const pathname  = usePathname();
  const router    = useRouter();
  const supabase  = createClientSupabaseClient();

  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const displayName = profile?.full_name ?? user.email?.split("@")[0] ?? "Admin";

  // Badge values
  const badges: Record<string, number> = {
    messages: unreadMessages,
    bookings: pendingBookings,
  };

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/login");
  }

  // Active check
  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  // Current page title for top bar
  const allItems = NAV_SECTIONS.flatMap((s) => s.items);
  const currentItem = allItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );

  // ── Sidebar content ───────────────────────────────────────────

  const SidebarContent = () => (
    <>
      {/* ── Logo area ──────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-4 border-b flex-shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Logo mark */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, oklch(0.35 0.18 302), oklch(0.49 0.18 302))",
            boxShadow:  "0 0 12px rgba(124,58,237,0.4)",
          }}
        >
          <span
            className="text-xs font-bold tracking-tight"
            style={{ color: "var(--accent)", fontFamily: "var(--font-playfair, serif)" }}
          >
            SL
          </span>
        </div>

        {/* Brand name — hidden when collapsed */}
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p
              className="text-sm font-semibold truncate leading-tight"
              style={{ color: "var(--text)", fontFamily: "var(--font-playfair, serif)" }}
            >
              Silverline
            </p>
            <p className="text-[10px] truncate" style={{ color: "var(--text-faint)" }}>
              Admin Dashboard
            </p>
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto btn-ghost p-1.5 hidden lg:flex flex-shrink-0"
          style={{ color: "var(--text-faint)" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto btn-ghost p-1.5 lg:hidden flex-shrink-0"
        >
          <X className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
        </button>
      </div>

      {/* ── Navigation ─────────────────── */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-1">
            {/* Section label */}
            {!collapsed && (
              <p
                className="px-4 pt-2 pb-1.5 text-[9px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "var(--text-faint)" }}
              >
                {section.label}
              </p>
            )}
            {collapsed && (
              <div
                className="mx-3 my-1.5 h-px"
                style={{ background: "var(--border)" }}
              />
            )}

            <div className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact);
                const badge  = item.badgeKey ? badges[item.badgeKey] : 0;
                const Icon   = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={[
                      "flex items-center gap-3 rounded-lg transition-all duration-150 relative group",
                      collapsed ? "px-2 py-2.5 justify-center" : "px-3 py-2.5",
                      active
                        ? "bg-primary/15"
                        : "hover:bg-white/[0.05]",
                    ].join(" ")}
                    style={
                      active
                        ? { borderLeft: "2px solid var(--accent)", marginLeft: 2, paddingLeft: collapsed ? "6px" : "10px" }
                        : {}
                    }
                  >
                    {/* Icon */}
                    <Icon
                      className="w-[18px] h-[18px] flex-shrink-0 transition-colors"
                      style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
                    />

                    {/* Label */}
                    {!collapsed && (
                      <span
                        className="flex-1 text-sm font-medium truncate transition-colors"
                        style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
                      >
                        {item.label}
                      </span>
                    )}

                    {/* Badge */}
                    {badge > 0 && (
                      <span
                        className={[
                          "flex-shrink-0 text-[10px] font-bold rounded-full flex items-center justify-center",
                          collapsed
                            ? "absolute -top-1 -right-1 w-4 h-4 text-[9px]"
                            : "min-w-[18px] h-[18px] px-1",
                        ].join(" ")}
                        style={{
                          background: item.badgeKey === "messages"
                            ? "var(--destructive)"
                            : "var(--warning)",
                          color: "#fff",
                        }}
                      >
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <span
                        className="absolute left-full ml-2 px-2.5 py-1.5 rounded-md
                          text-xs font-medium whitespace-nowrap z-50 pointer-events-none
                          opacity-0 group-hover:opacity-100 translate-x-1
                          group-hover:translate-x-0 transition-all duration-150 shadow-lg"
                        style={{
                          background: "var(--surface2)",
                          color:      "var(--text)",
                          border:     "1px solid var(--border)",
                        }}
                      >
                        {item.label}
                        {badge > 0 && (
                          <span
                            className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                            style={{
                              background: item.badgeKey === "messages"
                                ? "var(--destructive)"
                                : "var(--warning)",
                              color: "#fff",
                            }}
                          >
                            {badge}
                          </span>
                        )}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User area ──────────────────── */}
      <div
        className="p-3 border-t flex-shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        {collapsed ? (
          /* Collapsed: just avatar + sign out */
          <div className="flex flex-col items-center gap-2">
            <UserAvatar
              src={profile?.avatar_url ?? null}
              name={displayName}
              collapsed
            />
            <button
              onClick={handleSignOut}
              className="btn-ghost p-1.5 w-full flex justify-center"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
            </button>
          </div>
        ) : (
          /* Expanded: full user card */
          <div
            className="flex items-center gap-3 p-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}
          >
            <UserAvatar
              src={profile?.avatar_url ?? null}
              name={displayName}
              collapsed={false}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate leading-tight"
                style={{ color: "var(--text)" }}
              >
                {displayName}
              </p>
              <p
                className="text-[10px] truncate mt-0.5"
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
              <LogOut className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
            </button>
          </div>
        )}
      </div>
    </>
  );

  // ── Layout ────────────────────────────────────────────────────

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────── */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex flex-col",
          "transition-all duration-300 ease-in-out",
          "lg:relative lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-[68px]" : "w-64",
        ].join(" ")}
        style={{
          background:   "var(--surface)",
          borderRight:  "1px solid var(--border)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Main area ────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b flex-shrink-0"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          {/* Mobile menu button */}
          <button
            className="btn-ghost p-2 lg:hidden flex-shrink-0"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
          </button>

          {/* Page title (breadcrumb) */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className="text-xs hidden sm:block"
              style={{ color: "var(--text-faint)" }}
            >
              Dashboard
            </span>
            {currentItem && currentItem.href !== "/dashboard" && (
              <>
                <span
                  className="text-xs hidden sm:block"
                  style={{ color: "var(--text-faint)" }}
                >
                  /
                </span>
                <span
                  className="text-sm font-semibold truncate"
                  style={{
                    color:      "var(--text)",
                    fontFamily: "var(--font-playfair, serif)",
                  }}
                >
                  {currentItem.label}
                </span>
              </>
            )}
            {!currentItem || currentItem.href === "/dashboard" ? (
              <span
                className="text-sm font-semibold"
                style={{
                  color:      "var(--text)",
                  fontFamily: "var(--font-playfair, serif)",
                }}
              >
                Overview
              </span>
            ) : null}
          </div>

          {/* Unread message indicator in top bar */}
          {unreadMessages > 0 && (
            <Link
              href="/dashboard/messages"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
                text-xs font-semibold transition-all hover:opacity-80"
              style={{
                background: "rgba(220,53,69,0.12)",
                color:      "var(--destructive)",
                border:     "1px solid rgba(220,53,69,0.25)",
              }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {unreadMessages} unread
            </Link>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
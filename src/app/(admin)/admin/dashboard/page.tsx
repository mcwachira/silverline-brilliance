import { Suspense } from "react";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { sanityClient} from "@/src/sanity/lib/sanity";
import { format, startOfMonth, endOfMonth, subMonths} from "date-fns";
import StatCard from "@/src/components/admin/dashboard/StatCard";
import RecentBookings from "@/src/components/admin/booking/RecentBookings";
import BookingsByStatusChart from "@/src/components/admin/dashboard/BookingsByStatusChart";
import type { Booking } from "@/types/types";
import {
  CalendarDays,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import DashboardHeader from "@/src/components/admin/dashboard/DshboardHeader";
import StatCardSkeleton from "@/src/components/admin/dashboard/StatCardSkeleton";

export const metadata = { title: "Overview" };

type BookingRow = Omit<Booking, "preferred_contact"> & { preferred_contact: string };

function normalizePreferredContact(value: string): Booking["preferred_contact"] {
  if (value === "email" || value === "phone" || value === "whatsapp") return value;
  return "email";
}

async function getDashboardData() {
  const supabase = await createServerSupabaseClient();
  const now = new Date();

  const thisMonthStart = startOfMonth(now).toISOString();
  const thisMonthEnd = endOfMonth(now).toISOString();

  const lastMonthDate = subMonths(now, 1);
  const lastMonthStart = startOfMonth(lastMonthDate).toISOString();
  const lastMonthEnd = endOfMonth(lastMonthDate).toISOString();

  const [
    totalRes,
    pendingRes,
    confirmedRes,
    thisMonthRes,
    lastMonthRes,
    recentRes,
    statusRes,
    blogPosts,
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),

    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed"),

    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thisMonthStart)
      .lte("created_at", thisMonthEnd),

    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastMonthStart)
      .lte("created_at", lastMonthEnd),

    supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase.from("bookings").select("status"),

    sanityClient
      .fetch(`*[_type == "blogPost"] { _id, title, status, _createdAt }`)
      .catch(() => []),
  ]);

  // Safe fallback values
  const totalBookings = totalRes.count ?? 0;
  const pendingBookings = pendingRes.count ?? 0;
  const confirmedBookings = confirmedRes.count ?? 0;
  const thisMonthBookings = thisMonthRes.count ?? 0;
  const lastMonthBookings = lastMonthRes.count ?? 0;
  const recentBookingRows = (recentRes.data ?? []) as BookingRow[];
  const recentBookings: Booking[] = recentBookingRows.map((row) => ({
    ...row,
    preferred_contact: normalizePreferredContact(row.preferred_contact),
  }));
  const statusBreakdown = statusRes.data ?? [];

  // Status breakdown for chart
  const statusCounts = statusBreakdown.reduce(
    (acc: Record<string, number>, row: { status: string }) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const publishedPosts =
    (blogPosts as Array<{ status: string }>)?.filter(
      (p) => p.status === "published"
    ).length ?? 0;

  // Month trend calculation
  const monthTrend =
    lastMonthBookings === 0
      ? null
      : Math.round(
          ((thisMonthBookings - lastMonthBookings) /
            lastMonthBookings) *
            100
        );

  return {
    stats: {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      thisMonthBookings,
      monthTrend,
      publishedPosts,
    },
    recentBookings,
    statusCounts,
  };
}

export default async function DashboardPage() {
  const { stats, recentBookings, statusCounts } = await getDashboardData();

   const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarDays,
      color: "var(--primary)",
      accentColor: "oklch(0.49 0.18 302)",
      description: "All time",
    },
    {
      title: "This Month",
      value: stats.thisMonthBookings,
      icon: TrendingUp,
      color: "var(--accent)",
      accentColor: "oklch(0.88 0.17 85)",
      description: format(new Date(), "MMMM yyyy"),
      trend: stats.monthTrend,
    },
    {
      title: "Pending Review",
      value: stats.pendingBookings,
      icon: Clock,
      color: "oklch(0.85 0.15 85)",
      accentColor: "oklch(0.85 0.15 85)",
      description: "Awaiting confirmation",
    },
    {
      title: "Confirmed",
      value: stats.confirmedBookings,
      icon: CheckCircle2,
      color: "oklch(0.62 0.17 145)",
      accentColor: "oklch(0.62 0.17 145)",
      description: "Upcoming events",
    },
    {
      title: "Published Posts",
      value: stats.publishedPosts,
      icon: FileText,
      color: "oklch(0.65 0.15 220)",
      accentColor: "oklch(0.65 0.15 220)",
      description: "Live on your site",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <DashboardHeader />

      {/* Stat Cards */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {statCards.map((card, i) => (
            <StatCard
              key={card.title}
              {...card}
              index={i}
            />
          ))}
        </div>
      </Suspense>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Chart */}
        <div className="card p-6 lg:col-span-1 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-1 h-5 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, var(--accent), var(--primary))",
              }}
            />
            <h2
              className="text-base font-semibold"
              style={{
                fontFamily: "Playfair Display, serif",
                color: "var(--text)",
              }}
            >
              Bookings by Status
            </h2>
          </div>
          <div className="flex-1">
            <BookingsByStatusChart data={statusCounts} />
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div
                className="w-1 h-5 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, var(--accent), var(--primary))",
                }}
              />
              <h2
                className="text-base font-semibold"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "var(--text)",
                }}
              >
                Recent Bookings
              </h2>
            </div>
            
             <Link href="/admin/dashboard/bookings"
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150"
              style={{
                color: "var(--accent)",
                background: "oklch(0.88 0.17 85 / 0.1)",
                border: "1px solid oklch(0.88 0.17 85 / 0.2)",
              }}
            >
              View all →
            </Link>
          </div>
          <div className="flex-1">
            <RecentBookings bookings={recentBookings} />
          </div>
        </div>
      </div>
    </div>
  );
}
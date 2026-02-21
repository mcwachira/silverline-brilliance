"use client"
import { format } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import type { Booking } from "@/types/types";
import Link from "next/link";

interface Props {
  bookings: Booking[];
}

type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "reviewing";

interface StatusStyle {
  bg: string;
  color: string;
  border: string;
  label: string;
}

const STATUS_STYLES: Record<BookingStatus, StatusStyle> = {
  pending: {
    bg: "oklch(0.85 0.15 85 / 0.12)",
    color: "oklch(0.85 0.15 85)",
    border: "oklch(0.85 0.15 85 / 0.25)",
    label: "Pending",
  },
  confirmed: {
    bg: "oklch(0.65 0.15 220 / 0.12)",
    color: "oklch(0.65 0.15 220)",
    border: "oklch(0.65 0.15 220 / 0.25)",
    label: "Confirmed",
  },
  completed: {
    bg: "oklch(0.62 0.17 145 / 0.12)",
    color: "oklch(0.62 0.17 145)",
    border: "oklch(0.62 0.17 145 / 0.25)",
    label: "Completed",
  },
  cancelled: {
    bg: "oklch(0.63 0.26 29 / 0.12)",
    color: "oklch(0.63 0.26 29)",
    border: "oklch(0.63 0.26 29 / 0.25)",
    label: "Cancelled",
  },
  rescheduled: {
    bg: "oklch(0.49 0.18 302 / 0.12)",
    color: "oklch(0.75 0.15 315)",
    border: "oklch(0.49 0.18 302 / 0.25)",
    label: "Rescheduled",
  },
  reviewing: {
    bg: "oklch(0.49 0.18 302 / 0.12)",
    color: "oklch(0.7 0.15 310)",
    border: "oklch(0.49 0.18 302 / 0.25)",
    label: "Reviewing",
  },
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "oklch(0.88 0.17 85 / 0.08)",
          border: "1px solid oklch(0.88 0.17 85 / 0.15)",
        }}
      >
        <CalendarDays
          className="w-6 h-6"
          style={{ color: "var(--text-faint)" }}
        />
      </div>
      <div className="text-center">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          No bookings yet
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
          New booking requests will appear here
        </p>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  if (!name) return "—";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function RecentBookings({ bookings }: Props) {
  if (!bookings?.length) return <EmptyState />;

  return (
    <div className="space-y-1">
      {bookings.map((booking, index) => {
        const safeStatus =
          (booking.status as BookingStatus) in STATUS_STYLES
            ? (booking.status as BookingStatus)
            : "pending";

        const status = STATUS_STYLES[safeStatus];

        const clientName =
          booking.full_name?.trim() ||
          booking.client_name?.trim() ||
          "Unknown Client";

        const eventName = booking.event_name?.trim() || "Untitled Event";

        const eventDate = booking.event_date
          ? new Date(booking.event_date)
          : null;

        return (
          <Link
            key={booking.id}
            href={`/admin/dashboard/bookings/${booking.id}`}
            className="group flex items-center gap-3 px-3 py-3 rounded-xl
                       transition-all duration-200
                       hover:bg-[oklch(0.49_0.18_302/0.07)]
                       hover:translate-x-1"
            style={{
              animation: "fadeInUp 0.4s ease forwards",
              animationDelay: `${index * 40}ms`,
              opacity: 0,
            }}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center
                         text-xs font-bold flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.49 0.18 302 / 0.3), oklch(0.88 0.17 85 / 0.2))",
                border: "1px solid oklch(0.49 0.18 302 / 0.3)",
                color: "var(--accent)",
              }}
            >
              {getInitials(clientName)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--text)" }}
              >
                {clientName}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--text-faint)" }}
              >
                {eventName}
              </p>
            </div>

            {/* Date */}
            {eventDate && !isNaN(eventDate.getTime()) && (
              <div
                className="hidden sm:flex items-center gap-1 text-xs flex-shrink-0"
                style={{ color: "var(--text-faint)" }}
              >
                <Clock className="w-3 h-3" />
                {format(eventDate, "MMM d")}
              </div>
            )}

            {/* Status Badge */}
            <div
              className="text-[10px] font-semibold uppercase tracking-wide
                         px-2 py-0.5 rounded-full flex-shrink-0
                         transition-all duration-200
                         group-hover:scale-105"
              style={{
                background: status.bg,
                color: status.color,
                border: `1px solid ${status.border}`,
              }}
            >
              {status.label}
            </div>
          </Link>
        );
      })}

  
    </div>
  );
}
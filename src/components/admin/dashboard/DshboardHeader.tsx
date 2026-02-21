"use client";

import { format } from "date-fns";
import { Sparkles } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 flex items-center justify-between"
      style={{
        background: "linear-gradient(135deg, oklch(0.28 0.09 285) 0%, oklch(0.32 0.1 295) 50%, oklch(0.28 0.08 285) 100%)",
        border: "1px solid oklch(0.49 0.18 302 / 0.3)",
        boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.06), 0 4px 24px oklch(0.15 0.09 285 / 0.4)",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, oklch(0.49 0.18 302 / 0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.88 0.17 85 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles
            className="w-4 h-4"
            style={{ color: "var(--accent)" }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            {getGreeting()}
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{
            fontFamily: "Playfair Display, serif",
            background: "linear-gradient(135deg, var(--accent), oklch(0.91 0.16 90))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Overview
        </h1>
        <p
          className="text-sm mt-1.5"
          style={{ color: "var(--text-faint)" }}
        >
          {format(new Date(), "EEEE, MMMM do yyyy")}
        </p>
      </div>

      {/* Dot grid decoration */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 w-24 h-24 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.88 0.17 85) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
    </div>
  );
}
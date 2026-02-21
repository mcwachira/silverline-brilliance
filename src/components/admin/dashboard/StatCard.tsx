import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  accentColor: string;
  description?: string;
  trend?: number | null;
  index?: number;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  accentColor,
  description,
  trend,
  index = 0,
}: Props) {
  const hasTrend = trend !== null && trend !== undefined;
  const trendPositive = hasTrend && (trend ?? 0) >= 0;

  return (
    <div
      className="stat-card card-hover cursor-default group"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top accent line — always visible, color-matched */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          opacity: 0.6,
          transition: "opacity 0.2s",
        }}
      />
      {/* Hover: full opacity on accent line */}
      <style>{`
        .stat-card:hover .top-accent-${index} { opacity: 1 !important; }
      `}</style>

      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{
            background: `${accentColor.replace(")", " / 0.15)")}`,
            border: `1px solid ${accentColor.replace(")", " / 0.25)")}`,
            boxShadow: `0 0 16px ${accentColor.replace(")", " / 0.1)")}`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>

        {/* Trend badge */}
        {hasTrend && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: trendPositive
                ? "oklch(0.62 0.17 145 / 0.15)"
                : "oklch(0.63 0.26 29 / 0.15)",
              color: trendPositive
                ? "oklch(0.62 0.17 145)"
                : "oklch(0.63 0.26 29)",
              border: `1px solid ${
                trendPositive
                  ? "oklch(0.62 0.17 145 / 0.3)"
                  : "oklch(0.63 0.26 29 / 0.3)"
              }`,
            }}
          >
            {trendPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend ?? 0)}%
          </div>
        )}
      </div>

      {/* Value */}
      <p
        className="text-3xl font-bold mb-1 tabular-nums"
        style={{
          fontFamily: "Playfair Display, serif",
          color: "var(--text)",
          letterSpacing: "-0.02em",
        }}
      >
        {value.toLocaleString()}
      </p>

      {/* Title */}
      <p
        className="text-sm font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </p>

      {/* Description */}
      {description && (
        <p
          className="text-xs mt-1"
          style={{ color: "var(--text-faint)" }}
        >
          {description}
        </p>
      )}

      {/* Subtle background glow on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${accentColor.replace(
            ")",
            " / 0.06)"
          )} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
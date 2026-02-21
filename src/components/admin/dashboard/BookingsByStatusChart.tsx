"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart2 } from "lucide-react";

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending: { color: "oklch(0.85 0.15 85)", label: "Pending" },
  confirmed: { color: "oklch(0.65 0.15 220)", label: "Confirmed" },
  completed: { color: "oklch(0.62 0.17 145)", label: "Completed" },
  cancelled: { color: "oklch(0.63 0.26 29)", label: "Cancelled" },
  rescheduled: { color: "oklch(0.75 0.15 315)", label: "Rescheduled" },
  reviewing: { color: "oklch(0.49 0.18 302)", label: "Reviewing" },
};

interface Props {
  data: Record<string, number>;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-52 gap-3">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "oklch(0.49 0.18 302 / 0.1)",
          border: "1px solid oklch(0.49 0.18 302 / 0.2)",
        }}
      >
        <BarChart2
          className="w-6 h-6"
          style={{ color: "var(--text-faint)" }}
        />
      </div>
      <div className="text-center">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          No booking data yet
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
          Charts will appear once bookings come in
        </p>
      </div>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: "var(--text)",
        boxShadow: "0 4px 16px oklch(0 0 0 / 0.4)",
      }}
    >
      <span className="font-semibold">{name}</span>
      <span style={{ color: "var(--text-faint)" }}> — {value} booking{value !== 1 ? "s" : ""}</span>
    </div>
  );
}

export default function BookingsByStatusChart({ data }: Props) {
  const chartData = Object.entries(data)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: STATUS_CONFIG[status]?.label ?? status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      status,
      color: STATUS_CONFIG[status]?.color ?? "oklch(0.6 0.02 285)",
    }));

  if (chartData.length === 0) return <EmptyState />;

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-4">
      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-2xl font-bold"
            style={{
              fontFamily: "Playfair Display, serif",
              color: "var(--text)",
            }}
          >
            {total}
          </span>
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>
            total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {chartData.map((entry) => {
          const pct = Math.round((entry.value / total) * 100);
          return (
            <div key={entry.status} className="flex items-center gap-2.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: entry.color }}
              />
              <span
                className="text-xs flex-1 truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {entry.name}
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="h-1 rounded-full w-14"
                  style={{ background: "oklch(1 0 0 / 0.06)" }}
                >
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: entry.color }}
                  />
                </div>
                <span
                  className="text-xs w-6 text-right tabular-nums"
                  style={{ color: "var(--text-faint)" }}
                >
                  {entry.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS: Record<string, string> = {
  pending: '#FFC107',
  confirmed: '#17A2B8',
  completed: '#28A745',
  cancelled: '#DC3545',
  rescheduled: '#8B1FA8',
}

interface Props {
  data: Record<string, number>
}

export default function BookingsByStatusChart({ data }: Props) {
  const chartData = Object.entries(data)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      status,
    }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>No data yet</p>
      </div>
    )
  }

  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.status] ?? '#6c757d'} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--text)',
            }}
            formatter={(value: number, name: string) => [value, name]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', color: 'var(--text-faint)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
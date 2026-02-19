import type { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: number
  icon: LucideIcon
  color: string
  description?: string
}

export default function StatCard({ title, value, icon: Icon, color, description }: Props) {
  return (
    <div className="stat-card card-hover cursor-default">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'Playfair Display, serif' }}>
        {value.toLocaleString()}
      </p>
      <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{title}</p>
      {description && (
        <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>{description}</p>
      )}
    </div>
  )
}
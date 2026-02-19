'use client'

import { AlertTriangle, X } from 'lucide-react'
import type { ConfirmDialogProps } from '@/types'

export default function ConfirmDialog({
  open, title, description, confirmLabel = 'Confirm',
  cancelLabel = 'Cancel', variant = 'default', onConfirm, onCancel
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card w-full max-w-sm p-6 z-10 shadow-2xl" style={{ background: 'var(--surface-2)' }}>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: variant === 'destructive' ? 'rgba(220,53,69,0.15)' : 'rgba(139,31,168,0.15)',
            }}>
            <AlertTriangle className="w-5 h-5" style={{ color: variant === 'destructive' ? '#DC3545' : 'var(--purple)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
              {title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{description}</p>
          </div>
          <button onClick={onCancel} className="btn-ghost p-1 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1 justify-center">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 justify-center inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              variant === 'destructive' ? 'btn-danger' : 'btn-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
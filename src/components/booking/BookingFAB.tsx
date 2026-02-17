// components/booking/BookingFAB.tsx
'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import { QuickQuoteModal } from './QuickQuoteModal'

export function BookingFAB() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* FAB — hidden on desktop */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open quick quote form"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className="group flex items-center gap-2 rounded-full bg-amber-500 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition-all duration-200 hover:bg-amber-400 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          <Zap className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="text-sm">Quick Quote</span>
        </button>
      </div>

      {/* Controlled modal — shares state with FAB */}
      <QuickQuoteModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
import type { FC } from 'react'
import Link from 'next/link'

interface BookingHeroProps {
  title: string
  subtitle: string
}

const TRUST_SIGNALS = [
  { label: 'Professional Team', icon: '✦' },
  { label: 'Quality Equipment', icon: '✦' },
  { label: '24/7 Support', icon: '✦' },
  { label: 'Quote in 24 Hours', icon: '✦' },
] as const

export const BookingHero: FC<BookingHeroProps> = ({title,subtitle}) => (
<section
    aria-labelledby="booking-hero-heading"
    className="relative overflow-hidden bg-slate-950 py-20 md:py-28 lg:py-32"
  >
    {/* Dot-grid background — pure CSS, no JS */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(251,191,36,0.12) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    />

    {/* Radial glow */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl"
    />

    <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">

        {/* Eyebrow */}
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
          <span aria-hidden="true">✦</span>
          Professional AV Services
        </p>

        {/* Heading */}
        <h1
          id="booking-hero-heading"
          className="mb-5 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-lg text-slate-400 sm:text-xl">{subtitle}</p>

        {/* Skip link for keyboard/screen reader users */}
        <Link
          href="#booking-form"
          className="sr-only focus:not-sr-only focus:mb-8 focus:inline-block focus:rounded focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950 focus:outline-none"
        >
          Skip to booking form
        </Link>

        {/* Trust signals */}
        <ul
          aria-label="Our guarantees"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {TRUST_SIGNALS.map(({ label, icon }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-sm font-medium text-slate-400"
            >
              <span aria-hidden="true" className="text-amber-400 text-xs">{icon}</span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Bottom fade to page background */}
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"
    />
  </section>
)
 
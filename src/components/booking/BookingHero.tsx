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
] as const

export const BookingHero: FC<BookingHeroProps> = ({ title, subtitle }) => (
  <section
    aria-labelledby="booking-hero-heading"
    className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-purple-600 py-16 md:py-20 lg:py-24"
  >
    {/* Decorative grid pattern overlay */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }}
    />

    {/* Radial glow effects */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-purple-500/30 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-3xl"
    />

    <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">

        {/* Eyebrow label */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-300 backdrop-blur-sm">
          <span aria-hidden="true">✦</span>
          Professional AV Services
        </div>

        {/* Heading */}
        <h1
          id="booking-hero-heading"
          className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-lg text-purple-100 sm:text-xl md:text-2xl">
          {subtitle}
        </p>

        {/* Skip link for accessibility */}
        <Link
          href="#booking-form"
          className="sr-only focus:not-sr-only focus:mb-8 focus:inline-block focus:rounded-lg focus:bg-yellow-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-purple-950 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
          Skip to booking form
        </Link>

        {/* Trust signals */}
        <ul
          aria-label="Our guarantees"
          className="flex flex-wrap justify-center gap-x-8 gap-y-2"
        >
          {TRUST_SIGNALS.map(({ label, icon }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-sm font-medium text-purple-100"
            >
              <span aria-hidden="true" className="text-xs text-yellow-400">{icon}</span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Bottom wave SVG */}
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 h-16 sm:h-24"
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
          fill="currentColor"
          className="text-slate-950"
        />
      </svg>
    </div>
  </section>
)

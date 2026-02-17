import type { Metadata } from 'next'
import {BookingHero} from "@/src/components/booking/BookingHero";
import {BookingForm} from "@/src/components/booking/BookingForm";
import { BookingSidebar } from '@/src/components/booking/BookingSidebar';
import { BookingFAB } from '@/src/components/booking/BookingFAB';


export const metadata: Metadata = {
  title: 'Book Our Services | Silverline Brilliance',
  description:
    'Book professional audiovisual services for your event — live streaming, event coverage, photography, sound, and more. Get a confirmed quote within 24 hours.',
  openGraph: {
    title: 'Book Our Services | Silverline Brilliance',
    description:
      'Professional AV services for your event. Live streaming, photography, sound, lighting and more.',
    type: 'website',
    // images: [{ url: '/og-booking.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Our Services | Silverline Brilliance',
    description: 'Professional AV services. Get a confirmed quote within 24 hours.',
  },
}

export default function BookingPage() {
  return (
    <>
      {/* Zero JS — pure Server Component */}
      <BookingHero
        title="Book Our Services"
        subtitle="Tell us about your event and we'll get back to you with a confirmed quote within 24 hours."
      />

      <main id="booking-form" className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-12">

          {/* ── Client Island: Multi-step form ── */}
          <div className="lg:col-span-2">
            <BookingForm />
          </div>

          {/* ── Server Component: Sticky sidebar ── */}
          {/* Hidden on mobile — content mirrors trust signals in hero */}
          <aside
            className="hidden lg:block"
            aria-label="Booking information"
          >
            <div className="sticky top-24 space-y-5">
              <BookingSidebar />
            </div>
          </aside>

        </div>
      </main>

      {/* ── Client Island: Mobile-only floating action button ── */}
      {/* Only rendered/hydrated on mobile — lg:hidden */}
      <BookingFAB />
    </>
  )
}

import type { Metadata } from 'next'
import {BookingHero} from "@/src/components/booking/BookingHero";
import {BookingForm} from "@/src/components/booking/BookingForm";
import { BookingSidebar } from '@/src/components/booking/BookingSidebar';
import { BookingFAB } from '@/src/components/booking/BookingFAB';
import { ServiceSchema, FAQSchema, BreadcrumbSchema } from '@/src/components/seo/StructuredData';


export const metadata: Metadata = {
  title: 'Book AV Services | Silverline Technologies - Live Streaming & Events',
  description: 'Book professional audiovisual services for your event. Live streaming, event coverage, photography, sound systems, and stage lighting. Get confirmed quotes within 24 hours.',
  keywords: [
    'book AV services',
    'audiovisual booking Kenya',
    'live streaming booking',
    'event production booking',
    'photography services booking',
    'sound system rental',
    'stage lighting hire',
    'corporate event booking',
    'Silverline Technologies booking'
  ],
  openGraph: {
    title: 'Book AV Services | Silverline Technologies - Live Streaming & Events',
    description: 'Book professional audiovisual services for your event. Live streaming, event coverage, photography, sound systems, and stage lighting. Get confirmed quotes within 24 hours.',
    url: '/booking',
    images: [
      {
        url: '/og-booking.jpg',
        width: 1200,
        height: 630,
        alt: 'Book AV Services - Silverline Technologies',
      },
    ],
  },
  twitter: {
    title: 'Book AV Services | Silverline Technologies - Live Streaming & Events',
    description: 'Book professional audiovisual services for your event. Live streaming, event coverage, photography, sound systems, and stage lighting. Get confirmed quotes within 24 hours.',
    images: ['/og-booking.jpg'],
  },
  alternates: {
    canonical: '/booking',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BookingPage() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Booking', url: '/booking' },
  ];

  const bookingFaqs = [
    {
      question: 'How quickly can I get a quote for my event?',
      answer: 'We provide confirmed quotes within 24 hours of receiving your booking request. For urgent events, we can often provide same-day responses.'
    },
    {
      question: 'What services do you offer for corporate events?',
      answer: 'We offer comprehensive audiovisual services including live streaming, event coverage, professional photography, sound systems, stage lighting, and video production for corporate events.'
    },
    {
      question: 'Do you provide services outside Nairobi?',
      answer: 'Yes, we provide audiovisual services across Kenya and can travel to other East African countries for larger events.'
    },
    {
      question: 'What information do you need for a booking?',
      answer: 'We need your event date, venue location, expected attendance, services required, and any specific technical requirements. The more details you provide, the better we can tailor our services.'
    }
  ];

  return (
    <>
      {/* Structured Data */}
      <ServiceSchema 
        serviceName="Audiovisual Event Services" 
        description="Professional audiovisual services for events including live streaming, photography, sound systems, and stage lighting"
        category="Event Production"
      />
      <FAQSchema faqs={bookingFaqs} />
      <BreadcrumbSchema items={breadcrumbItems} />

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

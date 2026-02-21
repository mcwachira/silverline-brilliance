import { Metadata } from 'next';
import { Button } from "@/src/components/ui/button";
import ServicesHero from "@/src/components/services/ServicesHero";
import ServicesList from "@/src/components/services/ServicesList";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'AudioVisual Services | Live Streaming & Event Production Solutions',
  description: 'Comprehensive audiovisual services including live streaming, event coverage, photography, sound systems, stage lighting, and video production for corporate events in Kenya.',
  keywords: [
    'audiovisual services',
    'live streaming services',
    'event production',
    'corporate photography',
    'sound system rental',
    'stage lighting Kenya',
    'video production services',
    'hybrid events',
    'event coverage',
    'AV solutions'
  ],
  openGraph: {
    title: 'AudioVisual Services | Live Streaming & Event Production Solutions',
    description: 'Comprehensive audiovisual services including live streaming, event coverage, photography, sound systems, stage lighting, and video production for corporate events in Kenya.',
    url: '/services',
    images: [
      {
        url: '/og-services.jpg',
        width: 1200,
        height: 630,
        alt: 'AudioVisual Services - Silverline Technologies',
      },
    ],
  },
  twitter: {
    title: 'AudioVisual Services | Live Streaming & Event Production Solutions',
    description: 'Comprehensive audiovisual services including live streaming, event coverage, photography, sound systems, stage lighting, and video production for corporate events in Kenya.',
    images: ['/og-services.jpg'],
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      {/* CTA Banner (static) */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            We offer tailored packages to meet your specific requirements. Let’s
            discuss your project.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link href="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

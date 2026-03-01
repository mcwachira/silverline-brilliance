import Image from 'next/image';

import stageLighting from '@/src/assets/stage-lighting.jpg';
import Link from 'next/link';

export default function ContactHero() {
  return (
    <section
      className="relative overflow-hidden py-32 md:py-40 lg:py-48"
      aria-labelledby="contact-hero-heading"
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-background">
        <Image
          src={stageLighting}
          alt="Dynamic stage lighting with vibrant purple and gold colors representing Silverline Technologies' creative event production capabilities"
          fill
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          className="object-cover opacity-35"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 pt-16 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Overline */}
          <p className="contact-hero-overline text-sm font-semibold uppercase tracking-widest text-accent">
            Get In Touch
          </p>

          {/* Main Heading */}
          <h1
            id="contact-hero-heading"
            className="contact-hero-title font-heading text-4xl font-bold uppercase tracking-tight md:text-6xl lg:text-7xl"
          >
            Contact Us
          </h1>

          {/* Subtitle */}
          <p className="contact-hero-subtitle mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl lg:text-2xl">
            Let&apos;s create something amazing together
          </p>

          {/* Decorative Element */}
          <div className="contact-hero-divider flex items-center justify-center gap-2 pt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <div className="h-2 w-2 rotate-45 border-2 border-accent" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>

          {/* Contact Info Preview */}
          <div className="contact-hero-info flex flex-wrap items-center justify-center gap-4 pt-6 text-sm text-muted-foreground md:gap-8 md:text-base">
            
             <Link  href="tel:+254700040225"
              className="group flex items-center gap-2 transition-colors hover:text-accent"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>0700 040 225</span>
            </Link>

            <span className="hidden text-accent/30 md:inline">•</span>

            
              <Link href="mailto:info@silverlinetech.co.ke"
              className="group flex items-center gap-2 transition-colors hover:text-accent"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>info@silverlinetech.co.ke</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
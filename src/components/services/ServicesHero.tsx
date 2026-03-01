import Image from 'next/image';
import stageLighting from '@/src/assets/stage-lighting.jpg';

export default function ServicesHero() {
  return (
    <section
      className="relative overflow-hidden py-32 md:py-40 lg:py-48"
      aria-labelledby="services-hero-heading"
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-background">
        <Image
          src={stageLighting}
          alt="Professional stage lighting setup with dramatic purple and gold illumination showcasing Silverline Technologies' event production capabilities"
          fill
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          className="object-cover opacity-35"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 pt-16 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Overline */}
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            What We Offer
          </p>

          {/* Main Heading */}
          <h1
            id="services-hero-heading"
            className="services-hero-title font-heading text-4xl font-bold uppercase tracking-tight md:text-6xl lg:text-7xl"
          >
            Our Services
          </h1>

          {/* Subtitle */}
          <p className="services-hero-subtitle mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Comprehensive audiovisual solutions tailored to elevate your events
            and productions
          </p>

          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="h-px w-12 bg-accent/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            <div className="h-px w-12 bg-accent/50" />
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
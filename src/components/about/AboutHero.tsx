import Image from 'next/image';
import heroImage from '@/src/assets/hero-av-equipment.jpg';

export default function AboutHero() {
  return (
    <section
      className="relative overflow-hidden py-32 md:py-40"
      aria-labelledby="about-hero-heading"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Professional broadcast camera and audiovisual equipment setup showcasing Silverline Technologies' capabilities"
          fill
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          className="object-cover opacity-30"
        />
        {/* Gradient Overlay - adjusted opacity */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 pt-16 text-center">
        <h1
          id="about-hero-heading"
          className="mb-6 font-heading text-4xl font-bold uppercase tracking-tight text-gradient-gold md:text-6xl lg:text-7xl"
        >
          About Us
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
          Your trusted partner for professional audiovisual solutions across
          Kenya and East Africa
        </p>
      </div>
    </section>
  );
}
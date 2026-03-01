import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

import heroImage from "@/src/assets/hero-av-equipment.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Professional audiovisual equipment setup with mixing console and stage lighting"
          fill
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>

      <div className="relative z-20 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Main heading with gold gradient */}
          <h1 className="hero-title font-heading text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight">
            Silverline
          </h1>

          {/* Subheading */}
          <p className="hero-subtitle mt-4 text-foreground text-3xl md:text-4xl lg:text-5xl font-semibold uppercase tracking-wide">
            Technologies
          </p>

          {/* Tagline */}
          <p className="hero-tagline mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Elevating events with cutting-edge audiovisual solutions across Kenya
          </p>

          {/* CTA Button */}
          <div className="hero-cta mt-10 flex justify-center gap-4">
            <Button variant="gold" size="lg" asChild>
              <Link href="/contact" className="group">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
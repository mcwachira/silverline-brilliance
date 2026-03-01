import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

import heroImage from "@/src/assets/hero-av-equipment.jpg";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 bg-background">
        <Image
          src={heroImage}
          alt="Professional audiovisual equipment setup with mixing console and stage lighting"
          fill
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 pt-20 text-center">
        <div className="mx-auto max-w-4xl">
          {/* Main Heading - Gold */}
          <h1 className="font-heading text-6xl font-bold uppercase tracking-tight text-gold md:text-8xl lg:text-9xl">
            Silverline
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-3xl font-semibold uppercase tracking-wide text-foreground md:text-4xl lg:text-5xl">
            Technologies
          </p>

          {/* Tagline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Elevating events with cutting-edge audiovisual solutions across
            Kenya
          </p>

          {/* CTA Button */}
          <div className="mt-10 flex justify-center gap-4">
            <Button variant="gold" size="lg" asChild>
              <Link href="/contact" className="group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

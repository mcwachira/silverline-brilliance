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
          alt="Professional audiovisual equipment"
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="animate-fade-in-up">
          <h1 className="font-heading text-blue-700 text-6xl md:text-8xl text-gradient-gold uppercase animate-delay-200">
            Silverline
          </h1>

          <p className="mt-4 text-foreground text-4xl font-bold uppercase animate-fade-in-up animate-delay-400">
            Technologies
          </p>

          <div className="mt-10 flex justify-center gap-4 animate-fade-in-up animate-delay-600">
            <Button variant="gold" size="lg" asChild>
              <Link href="/contact">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

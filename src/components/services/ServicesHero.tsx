"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Image from "next/image";
import stageLighting from "@/src/assets/stage-lighting.jpg";

const ServicesHero = () => {
  return (
    <section className="relative py-32 gradient-hero overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={stageLighting}
          alt="Professional Services"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />

        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center pt-16">
        <LazyMotion features={domAnimation}>
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading font-black text-4xl md:text-6xl text-gradient-gold uppercase mb-4"
          >
            Our Services
          </m.h1>
        </LazyMotion>
      </div>
    </section>
  );
};

export default ServicesHero;

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroImage from "@/src/assets/hero-av-equipment.jpg";

export default function AboutHero() {
  return (
    <section className="relative py-32 gradient-hero overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="About Silverline Technologies"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-heading font-black text-4xl md:text-6xl text-gradient-gold uppercase mb-4"
        >
          About Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Your trusted partner for professional audiovisual solutions
        </motion.p>
      </div>
    </section>
  );
}

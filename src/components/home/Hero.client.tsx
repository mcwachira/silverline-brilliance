"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

import heroImage from "@/src/assets/hero-av-equipment.jpg";

const Hero = () => {
  return (
    <section className="realtive min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Professional audiovisual equipment"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center pt-20 ">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading font-black text-6xl md:text-8xl text-gradient-gold uppercase"
        >
          Silverline
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-foreground text-4xl font-bold uppercase"
        >
          Technologies
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center gap-4"
        >
          <Button variant="gold" size="lg" asChild>
            <Link href="/contact">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

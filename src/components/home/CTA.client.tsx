"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-20 gradient-primary text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-6 text-foreground">
          Ready to Elevate Your Event?
        </h2>

        <div className="flex justify-center gap-6">
          <Button variant="gold" size="xl" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>

          <a
            href="tel:0700040225"
            className="flex items-center gap-3 text-accent font-bold text-xl"
          >
            <Phone />
            0700040225
          </a>
        </div>
      </motion.div>
    </section>
  );
}

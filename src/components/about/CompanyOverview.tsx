"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import heroImage from "@/assets/hero-av-equipment.jpg";

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Events Covered" },
  { value: "200+", label: "Happy Clients" },
  { value: "50+", label: "Team Members" },
];

export default function CompanyOverview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gradient-gold mb-6">
            About Silverline Technologies
          </h2>

          <p className="text-muted-foreground mb-6">
            Silverline Technologies is a premier audiovisual services company
            delivering exceptional solutions for events, conferences, and
            corporate productions.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-4 text-center"
              >
                <div className="font-black text-3xl text-accent">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-4 border-2 border-accent rounded-xl rotate-3" />
          <Image
            src={heroImage}
            alt="Silverline Team"
            className="rounded-xl relative z-10"
          />
        </motion.div>
      </div>
    </section>
  );
}

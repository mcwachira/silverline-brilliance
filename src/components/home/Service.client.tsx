"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const services = [
  "Live Streaming",
  "Event Coverage",
  "Stage & Lighting",
  "Interpretation Services",
  "Photography",
  "Graphic Design",
  "Sound Setup",
  "Corporate Video",
  "Social Media Content",
  "Hybrid Conferencing",
];

export default function Services() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {services.map((service, i) => (
          <motion.div
            key={service}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5 }}
            className="glass-card p-6 rounded-xl text-center"
          >
            <Check className="mx-auto mb-3 text-accent" />
            <h3 className="text-sm font-semibold">{service}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

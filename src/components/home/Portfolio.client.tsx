"use client";
import { motion } from "framer-motion";
import Image from "next/image";

import soundEquipment from "@/src/assets/sound-equipment.jpg";
import stageLighting from "@/src/assets/stage-lighting.jpg";
import videoProduction from "@/src/assets/video-production.jpg";

const items = [
  { src: soundEquipment, title: "Audio Mixing", category: "Sound" },
  { src: stageLighting, title: "Stage Production", category: "Lighting" },
  { src: videoProduction, title: "Broadcast Control", category: "Video" },
];

const Portfolio = () => {
  return (
    <section className="py-24 gradient-primary ">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative aspect-[4/3] overflow-hidden rounded-xl"
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;

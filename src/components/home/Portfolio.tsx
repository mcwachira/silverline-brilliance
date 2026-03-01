import Image from "next/image";

import soundEquipment from "@/src/assets/sound-equipment.jpg";
import stageLighting from "@/src/assets/stage-lighting.jpg";
import videoProduction from "@/src/assets/video-production.jpg";

const portfolioItems = [
  {
    src: soundEquipment,
    title: "Professional Audio Mixing Console",
    category: "Sound",
  },
  {
    src: stageLighting,
    title: "Dynamic Stage Lighting Production",
    category: "Lighting",
  },
  {
    src: videoProduction,
    title: "Multi-Camera Broadcast Control Room",
    category: "Video",
  },
] as const;

export default function Portfolio() {
  return (
    <section
      className="bg-gradient-to-br from-primary via-primary-dark to-background py-20 md:py-28"
      aria-labelledby="portfolio-heading"
    >
      <div className="container mx-auto px-4">
        <h2 id="portfolio-heading" className="sr-only">
          Featured Work Gallery
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {portfolioItems.map((item) => (
            <figure
              key={item.category}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-accent/20"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-6 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                <span className="inline-block rounded-full bg-accent/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  {item.category}
                </span>
                <p className="mt-2 font-heading text-lg font-semibold text-white">
                  {item.title}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

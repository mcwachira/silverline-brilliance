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
      <div className="container mx-auto px-4">
        <h2 className="sr-only">Featured work</h2>
          <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
          </div>
      </div>
    </section>
  );
};

export default Portfolio;

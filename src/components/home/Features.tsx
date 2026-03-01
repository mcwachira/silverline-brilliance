import { Camera, Users, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  icon: LucideIcon;
  description: string;
}

const features: Feature[] = [
  {
    title: "Professional Equipment",
    icon: Camera,
    description: "State-of-the-art AV gear",
  },
  {
    title: "Experienced Team",
    icon: Users,
    description: "Industry professionals",
  },
  {
    title: "Affordable Pricing",
    icon: Check,
    description: "Quality without compromise",
  },
];

export default function Features() {
  return (
    <section
      className="bg-background py-20 md:py-28"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4">
        <h2 id="features-heading" className="sr-only">
          Why Choose Silverline Technologies
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="glass-card rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 ring-2 ring-accent/20">
                  <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-heading text-xl font-bold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

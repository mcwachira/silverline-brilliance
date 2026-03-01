import { Target, Eye, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PurposeItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const purposeItems: PurposeItem[] = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To deliver innovative and reliable audiovisual solutions that empower our clients to create impactful and memorable experiences.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'To be the leading audiovisual company recognized for excellence, innovation, and client satisfaction across the region.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description:
      'Excellence, integrity, innovation, and customer-centricity guide everything we do.',
  },
];

export default function PurposeSection() {
  return (
    <section
      className="bg-gradient-to-br from-primary via-primary-dark to-background py-20 md:py-28"
      aria-labelledby="purpose-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-16 text-center">
          <h2
            id="purpose-heading"
            className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider text-foreground md:text-4xl"
          >
            Our Purpose
          </h2>
          <div className="mx-auto h-1 w-20 bg-accent" />
        </header>

        {/* Purpose Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {purposeItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="glass-card group rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 ring-2 ring-accent/30 transition-transform group-hover:scale-110">
                  <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
                </div>

                <h3 className="mb-4 font-heading text-xl font-bold text-accent">
                  {item.title}
                </h3>

                <p className="leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
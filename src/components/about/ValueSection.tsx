import { Award, Users, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We deliver nothing but the highest quality in every project we undertake.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description:
      'We work closely with our clients to understand and exceed their expectations.',
  },
  {
    icon: Clock,
    title: 'Reliability',
    description:
      'Count on us to deliver on time, every time, with consistent professionalism.',
  },
];

export default function ValuesSection() {
  return (
    <section className="bg-background py-20 md:py-28" aria-labelledby="values-heading">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-16 text-center">
          <h2
            id="values-heading"
            className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider text-gradient-gold md:text-4xl"
          >
            What We Stand For
          </h2>
          <div className="mx-auto h-1 w-20 bg-accent" />
        </header>

        {/* Values Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article
                key={value.title}
                className="glass-card group rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 ring-2 ring-accent/30 transition-transform group-hover:scale-110">
                  <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
                </div>

                <h3 className="mb-4 font-heading text-xl font-bold text-accent">
                  {value.title}
                </h3>

                <p className="leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
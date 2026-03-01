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
] as const;

export default function Services() {
  return (
    <section
      className="bg-background py-20 md:py-28"
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-16 text-center">
          <h2
            id="services-heading"
            className="font-heading text-4xl font-bold uppercase tracking-wider text-gradient-gold md:text-5xl"
          >
            Our Services
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 bg-accent" />
        </header>

        {/* Services Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service) => (
            <article
              key={service}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
            >
              <Check
                className="mb-3 h-6 w-6 text-accent transition-transform group-hover:scale-110"
                aria-hidden="true"
              />
              <h3 className="font-heading font-semibold text-foreground">
                {service}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

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
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-gradient-gold uppercase tracking-wider mb-4">
            Our Services
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((service) => (
            <div
              key={service}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <Check className="w-6 h-6 text-accent mb-3" />
              <h3 className="font-heading font-semibold text-foreground">{service}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

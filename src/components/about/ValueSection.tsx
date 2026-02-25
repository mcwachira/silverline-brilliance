"use client";

import { Award, Users, Clock } from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "We deliver nothing but the highest quality in every project we undertake.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We work closely with our clients to understand and exceed their expectations.",
  },
  {
    icon: Clock,
    title: "Reliability",
    description:
      "Count on us to deliver on time, every time, with consistent professionalism.",
  },
];

export default function ValuesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gradient-gold uppercase tracking-widest mb-4">
            What We Stand For
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <div
              key={value.title}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl text-accent mb-4">
                {value.title}
              </h3>
              <p className="text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

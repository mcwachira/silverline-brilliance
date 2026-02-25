import { Camera, Users, Check } from "lucide-react";

const features = [
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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="sr-only">Why choose Silverline Technologies</h2>
          <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-8 rounded-2xl text-center"
            >
              <f.icon className="mx-auto mb-4 text-accent w-8 h-8" />
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.description}</p>
            </div>
          ))}
          </div>
      </div>
    </section>
  );
}

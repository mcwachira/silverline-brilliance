import { Target, Eye, Heart } from "lucide-react";

export default function PurposeSection() {
  return (
    <section className="py-24 gradient-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl uppercase tracking-widest mb-4">
            Our Purpose
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-heading font-bold text-xl text-accent mb-4">
              Our Mission
            </h3>
            <p className="text-muted-foreground">
              To deliver innovative and reliable audiovisual solutions that
              empower our clients to create impactful and memorable experiences.
            </p>
          </div>

          {/* Vision */}
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <Eye className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-heading font-bold text-xl text-accent mb-4">
              Our Vision
            </h3>
            <p className="text-muted-foreground">
              To be the leading audiovisual company recognized for excellence,
              innovation, and client satisfaction across the region.
            </p>
          </div>

          {/* Values */}
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-heading font-bold text-xl text-accent mb-4">
              Our Values
            </h3>
            <p className="text-muted-foreground">
              Excellence, integrity, innovation, and customer-centricity guide
              everything we do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import heroImage from "@/src/assets/hero-av-equipment.jpg";

export default function AboutHero() {
  return (
    <section className="relative py-32 gradient-hero overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="About Silverline Technologies"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center pt-16">
        <h1 className="font-heading font-black text-4xl md:text-6xl text-gradient-gold uppercase mb-4">
          About Us
        </h1>

        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your trusted partner for professional audiovisual solutions
        </p>
      </div>
    </section>
  );
}

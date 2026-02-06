import { Button } from "@/components/ui/button";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      {/* CTA Banner (static) */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            We offer tailored packages to meet your specific requirements. Let’s
            discuss your project.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link href="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

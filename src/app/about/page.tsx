import Link from "next/link";
import { Button } from "@/components/ui/button";
import AboutHero from "@/components/about/AboutHero";
import PurposeSection from "@/components/about/PurposeSection";
import ValuesSection from "@/components/about/ValueSection";
import CompanyOverview from "@/components/about/CompanyOverview";

const AboutPage = () => {
  return (
    <>
      <AboutHero />

      <CompanyOverview />

      <PurposeSection />

      <ValuesSection />

      {/* CTA — static, no animation needed */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
            Ready to Work Together?
          </h2>

          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Let’s discuss how we can bring your vision to life with our
            professional audiovisual solutions.
          </p>

          <Button variant="gold" size="xl" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default AboutPage;

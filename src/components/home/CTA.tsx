import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export default function CTA() {
  return (
    <section
      className="bg-gradient-to-br from-primary via-primary-dark to-accent/10 py-20 text-center"
      aria-labelledby="cta-heading"
    >
      <div className="container mx-auto px-4">
        <h2
          id="cta-heading"
          className="mb-6 font-heading text-4xl font-bold text-foreground md:text-5xl"
        >
          Ready to Elevate Your Event?
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
          Let`&apos;`s bring your vision to life with professional audiovisual
          solutions
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Button variant="gold" size="xl" asChild>
            <Link href="/contact" className="group">
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Link
            href="tel:+254700040225"
            className="flex items-center gap-3 rounded-lg border-2 border-accent bg-accent/5 px-6 py-3 font-bold text-accent transition-all hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/20"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            <span className="text-lg">0700 040 225</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

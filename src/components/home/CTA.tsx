import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "../ui/button";

export default function CTA() {
  return (
    <section className="py-20 gradient-primary text-center">
        <div>
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Ready to Elevate Your Event?
          </h2>

          <div className="flex justify-center gap-6">
            <Button variant="gold" size="xl" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>

            <a
              href="tel:0700040225"
              className="flex items-center gap-3 text-accent font-bold text-xl"
            >
              <Phone />
              0700040225
            </a>
          </div>
        </div>
    </section>
  );
}

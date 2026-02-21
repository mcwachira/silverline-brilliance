import { Metadata } from 'next';
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import AboutHero from "@/src/components/about/AboutHero";
import PurposeSection from "@/src/components/about/PurposeSection";
import ValuesSection from "@/src/components/about/ValueSection";
import CompanyOverview from "@/src/components/about/CompanyOverview";
import { OrganizationSchema, BreadcrumbSchema } from "@/src/components/seo/StructuredData";

export const metadata: Metadata = {
  title: 'About Silverline Technologies | Professional AV Company Kenya',
  description: 'Learn about Silverline Technologies - Kenya\'s leading audiovisual services company providing live streaming, event coverage, photography, and professional AV solutions since 2020.',
  keywords: [
    'about Silverline Technologies',
    'AV company Kenya',
    'audiovisual company Nairobi',
    'professional AV services',
    'event production company',
    'live streaming Kenya',
    'corporate events Kenya',
    'Silverline Technologies team'
  ],
  openGraph: {
    title: 'About Silverline Technologies | Professional AV Company Kenya',
    description: 'Learn about Silverline Technologies - Kenya\'s leading audiovisual services company providing live streaming, event coverage, photography, and professional AV solutions since 2020.',
    url: '/about',
    images: [
      {
        url: '/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'About Silverline Technologies - Professional AV Company',
      },
    ],
  },
  twitter: {
    title: 'About Silverline Technologies | Professional AV Company Kenya',
    description: 'Learn about Silverline Technologies - Kenya\'s leading audiovisual services company providing live streaming, event coverage, photography, and professional AV solutions since 2020.',
    images: ['/og-about.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

const AboutPage = () => {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
  ];

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema />
      <BreadcrumbSchema items={breadcrumbItems} />

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
            Let&apos;s discuss how we can bring your vision to life with our
            professional audiovisual solutions.
          </p>

          <Button variant="gold" size="xl" asChild>
            <Link href="/contact" passHref>
              Get in Touch
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default AboutPage;

import { Metadata } from 'next';
import ContactHero from "@/src/components/contact/ContactHero";
import ContactInfo from "@/src/components/contact/ContactInfo";
import ContactSidebar from "@/src/components/contact/ContactSidebar";
import ContactForm from "@/src/components/ContactForm";
import { LocalBusinessSchema, BreadcrumbSchema } from "@/src/components/seo/StructuredData";

export const metadata: Metadata = {
  title: 'Contact Silverline Technologies | AV Services Kenya',
  description: 'Get in touch with Silverline Technologies for professional audiovisual services in Kenya. Contact us for live streaming, event coverage, photography, sound systems, and stage lighting.',
  keywords: [
    'contact Silverline Technologies',
    'AV services Kenya contact',
    'audiovisual services Nairobi',
    'live streaming contact',
    'event production contact',
    'photography services Kenya',
    'sound system rental',
    'stage lighting Kenya'
  ],
  openGraph: {
    title: 'Contact Silverline Technologies | AV Services Kenya',
    description: 'Get in touch with Silverline Technologies for professional audiovisual services in Kenya. Contact us for live streaming, event coverage, photography, sound systems, and stage lighting.',
    url: '/contact',
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Silverline Technologies - AV Services',
      },
    ],
  },
  twitter: {
    title: 'Contact Silverline Technologies | AV Services Kenya',
    description: 'Get in touch with Silverline Technologies for professional audiovisual services in Kenya. Contact us for live streaming, event coverage, photography, sound systems, and stage lighting.',
    images: ['/og-contact.jpg'],
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
  ];

  return (
    <>
      {/* Structured Data */}
      <LocalBusinessSchema />
      <BreadcrumbSchema items={breadcrumbItems} />

      <ContactHero />

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ContactInfo />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactSidebar />
          </div>
        </div>
      </section>
    </>
  );
}

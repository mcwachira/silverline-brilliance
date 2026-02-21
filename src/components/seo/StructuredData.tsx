// TypeScript interfaces for structured data
interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization Schema
export function OrganizationSchema() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Silverline Technologies',
    alternateName: 'Silverline Brilliance',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://silverline-brilliance.com',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    description: 'Professional audiovisual services company specializing in live streaming, event coverage, photography, sound systems, and stage lighting for corporate events in Kenya.',
    foundingDate: '2020',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+254-XXX-XXX-XXX',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://twitter.com/silverlinetech',
      'https://facebook.com/silverlinetechnologies',
      'https://instagram.com/silverlinetechnologies',
      'https://linkedin.com/company/silverline-technologies',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Kenya',
      addressLocality: 'Nairobi',
    },
  };

  return <StructuredData type="organization" data={organizationData} />;
}

// Local Business Schema
export function LocalBusinessSchema() {
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Silverline Technologies',
    description: 'Professional audiovisual services company providing live streaming, event coverage, photography, sound systems, and stage lighting for corporate events in Kenya.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://silverline-brilliance.com',
    telephone: '+254-XXX-XXX-XXX',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Kenya',
      addressLocality: 'Nairobi',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-1.2921',
      longitude: '36.8219',
    },
    openingHours: 'Mo-Fr 08:00-18:00',
    priceRange: '$$',
    paymentAccepted: 'Cash, Credit Card, Mobile Money',
    currenciesAccepted: 'KES, USD',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
    servesCuisine: ['Audiovisual Services', 'Event Production'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Audiovisual Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Live Streaming Services',
            description: 'Professional live streaming for corporate events, conferences, and special occasions.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Event Coverage',
            description: 'Comprehensive event coverage with photography and videography.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sound Systems',
            description: 'Professional audio equipment and sound engineering services.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Stage Lighting',
            description: 'Professional lighting design and equipment for events.',
          },
        },
      ],
    },
  };

  return <StructuredData type="localBusiness" data={localBusinessData} />;
}

// Service Schema
export function ServiceSchema({ serviceName, description, category }: { 
  serviceName: string; 
  description: string; 
  category: string;
}) {
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: description,
    provider: {
      '@type': 'Organization',
      name: 'Silverline Technologies',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://silverline-brilliance.com',
    },
    serviceType: category,
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: serviceName,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: serviceName,
            description: description,
          },
          availability: 'https://schema.org/InStock',
        },
      ],
    },
  };

  return <StructuredData type="service" data={serviceData} />;
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }: { 
  items: Array<{ name: string; url: string }> 
}) {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData type="breadcrumb" data={breadcrumbData} />;
}

// FAQ Schema
export function FAQSchema({ faqs }: { 
  faqs: Array<{ question: string; answer: string }> 
}) {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <StructuredData type="faq" data={faqData} />;
}

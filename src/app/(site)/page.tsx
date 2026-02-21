import { Metadata } from 'next';
import FAQ from "../../components/FAQ";
import CTA from "../../components/home/CTA.client";
import Features from "../../components/home/Features.client";
import Hero from "../../components/home/Hero.client";
import Portfolio from "../../components/home/Portfolio.client";
import Services from "../../components/home/Services";
import Testimonials from "../../components/Testimonial";

export const metadata: Metadata = {
  title: 'Professional AudioVisual Services | Live Streaming & Event Production',
  description: 'Silverline Technologies provides expert audiovisual services including live streaming, event coverage, photography, sound systems, and stage lighting for corporate events across Kenya.',
  keywords: [
    'audiovisual services Kenya',
    'live streaming services',
    'event production company',
    'corporate event coverage',
    'professional photography',
    'sound system rental',
    'stage lighting services',
    'video production Kenya',
    'hybrid event solutions',
    'AV equipment rental'
  ],
  openGraph: {
    title: 'Professional AudioVisual Services | Live Streaming & Event Production',
    description: 'Expert audiovisual services including live streaming, event coverage, photography, sound systems, and stage lighting for corporate events across Kenya.',
    url: '/',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Silverline Technologies - Professional AudioVisual Services',
      },
    ],
  },
  twitter: {
    title: 'Professional AudioVisual Services | Live Streaming & Event Production',
    description: 'Expert audiovisual services including live streaming, event coverage, photography, sound systems, and stage lighting for corporate events across Kenya.',
    images: ['/og-home.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};
 
export const revalidate = 3600; // Revalidate every hour

const Home =() => {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
export default Home
import CTA from "@/components/home/CTA.client";
import Features from "@/components/home/Features.client";
import Hero from "@/components/home/Hero.client";
import Portfolio from "@/components/home/Portfolio.client";
import Services from "@/components/home/Service.client";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Portfolio />
      <Features />
      <CTA />
    </>
  );
}

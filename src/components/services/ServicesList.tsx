"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Video,
  Camera,
  Lightbulb,
  Globe,
  Palette,
  Headphones,
  Monitor,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import soundEquipment from "@/assets/sound-equipment.jpg";
import stageLighting from "@/assets/stage-lighting.jpg";
import videoProduction from "@/assets/video-production.jpg";
import heroImage from "@/assets/hero-av-equipment.jpg";

const services = [
  {
    icon: Video,
    title: "Live Streaming",
    description:
      "Professional multi-platform streaming services that bring your events to audiences worldwide.",
    features: [
      "Multi-platform streaming",
      "HD quality broadcast",
      "Real-time engagement tools",
      "Custom overlays & graphics",
    ],
    image: videoProduction,
  },
  {
    icon: Camera,
    title: "Event Coverage",
    description:
      "Comprehensive event documentation with multiple camera angles and professional editing.",
    features: [
      "Full event documentation",
      "Multiple camera angles",
      "Professional editing",
      "Same-day highlights",
    ],
    image: heroImage,
  },
  {
    icon: Headphones,
    title: "Sound Setup",
    description:
      "Professional audio solutions ensuring crystal-clear sound for any venue size.",
    features: [
      "Professional audio systems",
      "Microphone solutions",
      "Acoustic optimization",
      "Live mixing",
    ],
    image: soundEquipment,
  },
  {
    icon: Lightbulb,
    title: "Stage & Lighting",
    description:
      "Transform any space with our professional stage design and lighting systems.",
    features: [
      "Stage design & setup",
      "LED lighting systems",
      "Special effects lighting",
      "Truss & rigging",
    ],
    image: stageLighting,
  },
  {
    icon: Globe,
    title: "Interpretation Services",
    description:
      "Break language barriers with professional interpretation services and equipment.",
    features: [
      "Simultaneous interpretation",
      "Translation equipment",
      "Multi-language support",
      "Professional interpreters",
    ],
    image: videoProduction,
  },
  {
    icon: Monitor,
    title: "Social Media Content",
    description: "Engaging content optimized for all social platforms.",
    features: [
      "Content creation",
      "Platform optimization",
      "Engagement strategies",
      "Analytics & reporting",
    ],
    image: heroImage,
  },
  {
    icon: Users,
    title: "Hybrid & Video Conferencing",
    description: "Seamlessly connect in-person and remote audiences.",
    features: [
      "Virtual event platforms",
      "Webinar hosting",
      "Interactive conferencing",
      "Technical support",
    ],
    image: videoProduction,
  },
];

const ServicesList = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } gap-8 lg:gap-16 items-center mb-20`}
          >
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div
                  className={`absolute -inset-4 border-2 border-accent rounded-xl ${
                    index % 2 === 0 ? "-rotate-2" : "rotate-2"
                  }`}
                />
                <Image
                  src={service.image}
                  alt={service.title}
                  className="rounded-xl w-full h-64 lg:h-80 object-cover relative z-10"
                />
              </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                  <service.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-gradient-gold">
                  {service.title}
                </h3>
              </div>

              <p className="text-muted-foreground mb-6">
                {service.description}
              </p>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant="gold-outline" asChild>
                <Link href="/contact">
                  Get a Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesList;

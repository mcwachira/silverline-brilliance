"use client";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of events do you cover?",
    answer:
      "We cover a wide range of events including corporate conferences, weddings, concerts, product launches, seminars, religious gatherings, and private celebrations. No event is too big or too small for our team.",
  },
  {
    question: "How far in advance should I book your services?",
    answer:
      "We recommend booking at least 2-4 weeks in advance to ensure availability, especially during peak seasons. However, we do accommodate last-minute requests when possible. Contact us to check availability.",
  },
  {
    question: "Do you provide equipment rental without operators?",
    answer:
      "Yes, we offer both full-service packages with our professional operators and equipment-only rentals. For equipment rentals, we provide a brief orientation and can offer technical support if needed.",
  },
  {
    question: "What is included in your live streaming packages?",
    answer:
      "Our live streaming packages include multi-camera setup, professional audio, graphics overlays, real-time switching, and streaming to your preferred platforms (YouTube, Facebook, Zoom, etc.). We also provide recording of the stream.",
  },
  {
    question:
      "Can you handle hybrid events with both in-person and virtual attendees?",
    answer:
      "Absolutely! We specialize in hybrid event solutions that seamlessly connect in-person and remote audiences. Our setup includes interactive Q&A features, virtual breakout rooms, and high-quality streaming.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We are based in Nairobi, Kenya, and serve clients throughout East Africa. For events outside Nairobi, we can arrange transportation of equipment and crew. International projects are also considered.",
  },
  {
    question: "How do you handle technical issues during an event?",
    answer:
      "Our team comes prepared with backup equipment and contingency plans. We conduct thorough pre-event testing and have experienced technicians on-site throughout your event to handle any issues immediately.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfers, M-Pesa, and cash payments. A deposit is required to secure your booking, with the balance due before or on the event day as per our agreement.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-gradient-gold uppercase tracking-widest mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our services, booking
            process, and more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-accent py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

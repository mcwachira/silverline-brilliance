"use client";

import { motion } from "framer-motion";
import {
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";

const ContactSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Social Links */}
      <div className="glass-card rounded-2xl p-8">
        <h3 className="font-heading font-bold text-xl text-foreground mb-4">
          Connect With Us
        </h3>
        <p className="text-muted-foreground mb-6">
          Follow us on social media to stay updated with our latest projects and
          industry news.
        </p>
        <div className="flex gap-3">
          {[Facebook, Instagram, Twitter, Linkedin, Youtube].map(
            (Icon, index) => (
              <a
                key={index}
                href="#"
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            ),
          )}
        </div>
      </div>

      {/* Working Hours */}
      <div className="glass-card rounded-2xl p-8">
        <h3 className="font-heading font-bold text-xl text-foreground mb-4">
          Working Hours
        </h3>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex justify-between">
            <span>Monday - Friday</span>
            <span className="text-foreground">8:00 AM - 6:00 PM</span>
          </li>
          <li className="flex justify-between">
            <span>Saturday</span>
            <span className="text-foreground">9:00 AM - 4:00 PM</span>
          </li>
          <li className="flex justify-between">
            <span>Sunday</span>
            <span className="text-foreground">Closed</span>
          </li>
        </ul>
      </div>

      {/* Quick Contact */}
      <div className="glass-card rounded-2xl p-8">
        <h3 className="font-heading font-bold text-xl text-foreground mb-4">
          Quick Response
        </h3>
        <p className="text-muted-foreground mb-4">
          Need an urgent response? Call us directly for immediate assistance.
        </p>
        <a
          href="tel:0700040225"
          className="flex items-center gap-3 text-accent font-heading font-bold text-xl"
        >
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          0700040225
        </a>
      </div>
    </motion.div>
  );
};

export default ContactSidebar;

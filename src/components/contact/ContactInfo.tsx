"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    label: "Call Us",
    value: "0700040225",
    href: "tel:0700040225",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "silverlinetech@gmail.com",
    href: "mailto:silverlinetech@gmail.com",
  },
  { icon: MapPin, label: "Visit Us", value: "Nairobi, Kenya", href: "#" },
];

const ContactInfo = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
      {contactInfo.map((info, index) => (
        <motion.a
          key={info.label}
          href={info.href}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="glass-card rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <info.icon className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-heading font-bold text-lg text-accent mb-2">
            {info.label}
          </h3>
          <p className="font-medium">{info.value}</p>
        </motion.a>
      ))}
    </div>
  );
};

export default ContactInfo;

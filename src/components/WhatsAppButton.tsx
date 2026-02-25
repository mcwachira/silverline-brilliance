import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "254700040225"; // Kenya format
  const message = encodeURIComponent(
    "Hello! I would like to inquire about your audiovisual services.",
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" fill="white" />

      {/* Pulse animation using CSS instead of Framer Motion */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </a>
  );
};

export default WhatsAppButton;

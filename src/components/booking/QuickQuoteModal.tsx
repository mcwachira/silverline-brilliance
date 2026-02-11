"use client";

import { useState, useEffect } from "react";
import { X, Send, User, Mail, Phone, Calendar, MessageSquare, Zap } from "lucide-react";

interface QuickQuoteModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface QuickQuoteData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  message: string;
}

export default function QuickQuoteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<QuickQuoteData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    message: "",
  });

  const services = [
    { value: "live-streaming", label: "Live Streaming" },
    { value: "event-coverage", label: "Event Coverage" },
    { value: "photography", label: "Photography" },
    { value: "corporate-video", label: "Corporate Video" },
    { value: "sound-setup", label: "Sound Setup" },
    { value: "lighting", label: "Stage & Lighting" },
    { value: "other", label: "Other" },
  ];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleInputChange = (field: keyof QuickQuoteData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Quick quote submitted:", formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      message: "",
    });
    setIsSubmitted(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return (
      <>
        {/* Floating Quick Quote Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-foreground rounded-full shadow-lg hover:from-yellow-600 hover:to-yellow-500 transition-all duration-300 hover:scale-105 group"
        >
          <Zap className="h-5 w-5" />
          <span className="font-medium">Quick Quote</span>
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-20 animate-ping" />
        </button>
      </>
    );
  }

  return (
    <>
      {/* Floating Quick Quote Button (hidden when modal is open) */}
      <div className="fixed bottom-6 right-6 z-40 opacity-0 pointer-events-none">
        <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-foreground rounded-full shadow-lg">
          <Zap className="h-5 w-5" />
          <span className="font-medium">Quick Quote</span>
        </button>
      </div>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        {/* Modal */}
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Quick Quote</h3>
                <p className="text-sm text-muted-foreground">Get a fast estimate</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Service Needed <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      required
                      min={getMinDate()}
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quick Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us briefly about your event..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-foreground rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Request Quote
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success State */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">Quote Request Sent!</h4>
                <p className="text-muted-foreground mb-6">
                  We'll get back to you within 24 hours with a quick estimate.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Send Another
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-foreground rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

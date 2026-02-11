"use client";

import { Check } from "lucide-react";
import { BookingData } from "../BookingContext";

interface ServicesStepProps {
  data: BookingData;
  updateData: (updates: Partial<BookingData>) => void;
}

const services = [
  {
    id: "live-streaming",
    name: "Live Streaming",
    description: "Professional multi-camera live streaming with high-quality production",
    icon: "🎥",
    price: "From $1,500"
  },
  {
    id: "event-coverage",
    name: "Event Coverage",
    description: "Complete event documentation with photo and video coverage",
    icon: "📹",
    price: "From $2,000"
  },
  {
    id: "photography",
    name: "Photography",
    description: "Professional photography services for all types of events",
    icon: "📸",
    price: "From $800"
  },
  {
    id: "corporate-video",
    name: "Corporate Video Coverage",
    description: "Corporate events, conferences, and business meeting coverage",
    icon: "🏢",
    price: "From $1,200"
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    description: "Event branding, promotional materials, and digital graphics",
    icon: "🎨",
    price: "From $500"
  },
  {
    id: "sound-setup",
    name: "Sound Setup",
    description: "Professional audio systems and sound engineering",
    icon: "🔊",
    price: "From $1,000"
  },
  {
    id: "stage-lighting",
    name: "Stage & Lighting",
    description: "Complete stage setup with professional lighting systems",
    icon: "💡",
    price: "From $1,500"
  },
  {
    id: "interpretation",
    name: "Interpretation Services & Equipment",
    description: "Simultaneous interpretation and equipment rental",
    icon: "🎧",
    price: "From $800"
  },
  {
    id: "social-media",
    name: "Social Media Content",
    description: "Real-time social media coverage and content creation",
    icon: "📱",
    price: "From $600"
  },
  {
    id: "video-conferencing",
    name: "Hybrid & Video Conferencing",
    description: "Hybrid event solutions and video conferencing setup",
    icon: "🌐",
    price: "From $1,200"
  }
];

export default function ServicesStep({ data, updateData }: ServicesStepProps) {
  const handleServiceToggle = (serviceId: string) => {
    const selectedServices = data.selectedServices.includes(serviceId)
      ? data.selectedServices.filter(id => id !== serviceId)
      : [...data.selectedServices, serviceId];
    
    updateData({ selectedServices });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <span className="text-2xl">🛠️</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Select Services</h3>
        <p className="text-muted-foreground">Choose the services you need for your event (multi-select allowed)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = data.selectedServices.includes(service.id);
          
          return (
            <div
              key={service.id}
              onClick={() => handleServiceToggle(service.id)}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? "border-purple-500 bg-purple-50 shadow-lg"
                  : "border-border hover:border-purple-300 hover:shadow-md"
              }`}
            >
              {/* Checkbox */}
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? "border-purple-500 bg-purple-500"
                  : "border-gray-300"
              }`}>
                {isSelected && <Check className="h-4 w-4 text-white" />}
              </div>

              {/* Service Icon */}
              <div className="flex items-start gap-4">
                <div className="text-3xl">{service.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{service.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                  <p className="text-sm font-medium text-purple-600">{service.price}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Services Summary */}
      {data.selectedServices.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2">
            Selected Services ({data.selectedServices.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.selectedServices.map((serviceId) => {
              const service = services.find(s => s.id === serviceId);
              return service ? (
                <span
                  key={serviceId}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {service.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <p className="text-sm text-purple-700">
          <strong>Note:</strong> You can select multiple services. The final quote will be customized based on your specific requirements and event details.
        </p>
      </div>
    </div>
  );
}

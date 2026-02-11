"use client";

import { Phone, Mail, MessageCircle, Check, Star, Clock, Users, MapPin } from "lucide-react";
import { BookingData, useBooking } from "./BookingContext";

const services = [
  { id: "live-streaming", name: "Live Streaming", basePrice: 1500 },
  { id: "event-coverage", name: "Event Coverage", basePrice: 2000 },
  { id: "photography", name: "Photography", basePrice: 800 },
  { id: "corporate-video", name: "Corporate Video Coverage", basePrice: 1200 },
  { id: "graphic-design", name: "Graphic Design", basePrice: 500 },
  { id: "sound-setup", name: "Sound Setup", basePrice: 1000 },
  { id: "stage-lighting", name: "Stage & Lighting", basePrice: 1500 },
  { id: "interpretation", name: "Interpretation Services & Equipment", basePrice: 800 },
  { id: "social-media", name: "Social Media Content", basePrice: 600 },
  { id: "video-conferencing", name: "Hybrid & Video Conferencing", basePrice: 1200 }
];

export default function BookingSummary() {
  const { bookingData } = useBooking();

  // Calculate estimated total
  const calculateEstimate = () => {
    const subtotal = bookingData.selectedServices.reduce((total: number, serviceId: string) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.basePrice || 0);
    }, 0);

    // Add complexity factor based on attendees
    const complexityFactor = bookingData.expectedAttendees > 500 ? 1.5 : 
                            bookingData.expectedAttendees > 200 ? 1.3 : 1;
    
    return Math.round(subtotal * complexityFactor);
  };

  const estimate = calculateEstimate();
  const tax = Math.round(estimate * 0.16); // 16% VAT
  const total = estimate + tax;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-card rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Booking Summary
        </h3>

        <div className="space-y-4">
          {/* Event Name */}
          {bookingData.eventName && (
            <div>
              <h4 className="font-semibold text-foreground text-lg">{bookingData.eventName}</h4>
            </div>
          )}

          {/* Date and Time */}
          {bookingData.eventDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(bookingData.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {bookingData.startTime && ` at ${bookingData.startTime}`}
                {bookingData.endTime && ` - ${bookingData.endTime}`}
              </span>
            </div>
          )}

          {/* Location */}
          {bookingData.venue && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{bookingData.venue}</span>
            </div>
          )}

          {/* Attendees */}
          {bookingData.expectedAttendees > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{bookingData.expectedAttendees} expected attendees</span>
            </div>
          )}

          {/* Selected Services */}
          {bookingData.selectedServices.length > 0 && (
            <div>
              <h5 className="font-medium text-foreground mb-2">Selected Services:</h5>
              <div className="flex flex-wrap gap-2">
                {bookingData.selectedServices.map((serviceId: string) => {
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

          {/* Price Estimate */}
          {bookingData.selectedServices.length > 0 && (
            <div className="border-t border-border pt-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="text-foreground">${estimate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (16%):</span>
                  <span className="text-foreground">${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-yellow-600">
                  <span>Total Estimate:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Final quote will be provided after review
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-card rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Need Help?</h3>
        
        <div className="space-y-3">
          <a
            href="tel:+254712345678"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Phone className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Call Us</p>
              <p className="text-sm text-muted-foreground">+254 712 345 678</p>
            </div>
          </a>

          <a
            href="mailto:bookings@silverlinebrilliance.com"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Email Us</p>
              <p className="text-sm text-muted-foreground">bookings@silverlinebrilliance.com</p>
            </div>
          </a>

          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Live Chat</p>
              <p className="text-sm text-muted-foreground">Available 9AM-6PM</p>
            </div>
          </button>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-purple-900 mb-4">Why Choose Us?</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-purple-800">Free initial consultation</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-purple-800">Flexible payment options</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-purple-800">Professional equipment</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-purple-800">Experienced team</span>
          </div>
        </div>
      </div>
    </div>
  );
}

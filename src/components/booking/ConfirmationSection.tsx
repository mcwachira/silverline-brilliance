"use client";

import { useState } from "react";
import { Check, Download, Home, Eye, Copy, Mail, Phone, Calendar, Clock } from "lucide-react";
import { BookingData } from "./BookingContext";

interface ConfirmationSectionProps {
  bookingData: BookingData;
}

export default function ConfirmationSection({ bookingData }: ConfirmationSectionProps) {
  const [bookingReference] = useState(() => {
    // Generate a unique booking reference
    const prefix = "SLB";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  });

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadConfirmation = () => {
    // In a real implementation, this would generate and download a PDF
    const confirmationData = {
      reference: bookingReference,
      eventName: bookingData.eventName,
      eventDate: bookingData.eventDate,
      name: bookingData.fullName,
      email: bookingData.email,
      phone: bookingData.phone,
      services: bookingData.selectedServices,
    };

    const blob = new Blob([JSON.stringify(confirmationData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-confirmation-${bookingReference}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-2xl shadow-xl p-8 text-center">
      {/* Success Animation */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        
        {/* Confetti Effect (CSS animation) */}
        <div className="relative h-32 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
          <div className="absolute top-0 left-1/4 text-2xl animate-pulse">✨</div>
          <div className="absolute top-4 right-1/4 text-xl animate-bounce delay-100">🎊</div>
          <div className="absolute bottom-0 left-1/3 text-3xl animate-pulse delay-200">🌟</div>
          <div className="absolute bottom-4 right-1/3 text-2xl animate-bounce delay-300">🎈</div>
        </div>
      </div>

      {/* Success Message */}
      <h2 className="text-3xl font-bold text-foreground mb-4">
        Booking Request Received!
      </h2>
      
      {/* Booking Reference */}
      <div className="bg-purple-50 rounded-xl p-6 mb-6 border border-purple-200">
        <p className="text-sm text-purple-600 font-medium mb-2">Booking Reference Number</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl font-bold text-purple-900">{bookingReference}</span>
          <button
            onClick={copyToClipboard}
            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
            title="Copy reference"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
        {copied && (
          <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>
        )}
      </div>

      {/* Thank You Message */}
      <div className="mb-8">
        <p className="text-lg text-foreground mb-4">
          Thank you! We've received your booking request.
        </p>
        <p className="text-muted-foreground">
          Our team will review and contact you within 24 hours.
        </p>
      </div>

      {/* Event Summary */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
        <h3 className="font-semibold text-foreground mb-4">Event Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {new Date(bookingData.eventDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          {bookingData.startTime && (
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {bookingData.startTime} {bookingData.endTime && `- ${bookingData.endTime}`}
              </span>
            </div>
          )}
          {bookingData.venue && (
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{bookingData.venue}</span>
            </div>
          )}
          {bookingData.selectedServices.length > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-foreground mb-2">
                Services Requested ({bookingData.selectedServices.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {bookingData.selectedServices.map((serviceId) => (
                  <span
                    key={serviceId}
                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                  >
                    {serviceId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">Next Steps</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="h-3 w-3 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Email confirmation sent</p>
              <p className="text-xs text-blue-700">Check your inbox for booking details</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Phone className="h-3 w-3 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Team review (within 24 hours)</p>
              <p className="text-xs text-blue-700">Our team will review your requirements</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Eye className="h-3 w-3 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Detailed quote provided</p>
              <p className="text-xs text-blue-700">You'll receive a customized proposal</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-3 w-3 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Booking confirmation</p>
              <p className="text-xs text-blue-700">Finalize details and secure your date</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={downloadConfirmation}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download Confirmation
        </button>
        
        <a
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </a>
        
        <a
          href="/portfolio"
          className="flex items-center justify-center gap-2 px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
        >
          <Eye className="h-4 w-4" />
          View Our Work
        </a>
      </div>

      {/* Contact Info */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">
          Need to make changes to your booking?
        </p>
        <p className="text-sm text-foreground">
          Contact us at <a href="mailto:bookings@silverlinebrilliance.com" className="text-purple-600 hover:underline">bookings@silverlinebrilliance.com</a> or call <a href="tel:+254712345678" className="text-purple-600 hover:underline">+254 712 345 678</a>
        </p>
      </div>
    </div>
  );
}

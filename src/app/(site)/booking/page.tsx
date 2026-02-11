import { Metadata } from "next";
import { BookingProvider } from "@/src/components/booking/BookingContext";
import BookingHero from "@/src/components/booking/BookingHero";
import BookingForm from "@/src/components/booking/BookingForm";
import BookingSummary from "@/src/components/booking/BookingSummary";
import QuickQuoteModal from "@/src/components/booking/QuickQuoteModal";

export const metadata: Metadata = {
  title: "Book Our Services | Silverline Brilliance",
  description: "Book professional audiovisual services for your event. Live streaming, event coverage, photography, and more.",
};

export default function BookingPage() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <BookingHero />
        
        {/* Booking Form Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2">
              <BookingForm />
            </div>
            
            {/* Summary Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BookingSummary />
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Quote Modal */}
        <QuickQuoteModal />
      </div>
    </BookingProvider>
  );
}

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useBooking } from "./BookingContext";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import EventInfoStep from "./steps/EventInfoStep";
import ServicesStep from "./steps/ServicesStep";
import AdditionalInfoStep from "./steps/AdditionalInfoStep";
import ConfirmationSection from "./ConfirmationSection";

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { bookingData, updateBookingData } = useBooking();

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Here you would typically send the data to your backend
    console.log("Booking submitted:", bookingData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return <ConfirmationSection bookingData={bookingData} />;
  }

  return (
    <div className="bg-card rounded-2xl shadow-xl p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">
            {currentStep === 1 && "Your Details"}
            {currentStep === 2 && "Event Details"}
            {currentStep === 3 && "Select Services"}
            {currentStep === 4 && "Additional Details"}
          </h2>
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep}/{totalSteps}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Form Steps */}
      <div className="min-h-[500px]">
        {currentStep === 1 && (
          <PersonalInfoStep 
            data={bookingData} 
            updateData={updateBookingData} 
          />
        )}
        {currentStep === 2 && (
          <EventInfoStep 
            data={bookingData} 
            updateData={updateBookingData} 
          />
        )}
        {currentStep === 3 && (
          <ServicesStep 
            data={bookingData} 
            updateData={updateBookingData} 
          />
        )}
        {currentStep === 4 && (
          <AdditionalInfoStep 
            data={bookingData} 
            updateData={updateBookingData} 
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-border">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            currentStep === 1
              ? "text-muted-foreground cursor-not-allowed"
              : "border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {currentStep < totalSteps ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-foreground rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-500 transition-all shadow-lg"
          >
            <Check className="h-4 w-4" />
            Submit Booking Request
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface BookingData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  company: string;
  
  // Event Information
  eventType: string;
  eventName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  expectedAttendees: number;
  venue: string;
  venueAddress: string;
  
  // Services
  selectedServices: string[];
  
  // Additional Information
  specialRequirements: string;
  budgetRange: string;
  referralSource: string;
  contactMethod: string;
  uploadedFiles: File[];
}

const initialBookingData: BookingData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  eventType: "",
  eventName: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  expectedAttendees: 0,
  venue: "",
  venueAddress: "",
  selectedServices: [],
  specialRequirements: "",
  budgetRange: "",
  referralSource: "",
  contactMethod: "email",
  uploadedFiles: [],
};

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (updates: Partial<BookingData>) => void;
  resetBookingData: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const resetBookingData = () => {
    setBookingData(initialBookingData);
  };

  return (
    <BookingContext.Provider value={{
      bookingData,
      updateBookingData,
      resetBookingData
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

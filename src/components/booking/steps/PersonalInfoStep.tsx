"use client";

import { User, Mail, Phone, Building } from "lucide-react";
import { BookingData } from "../BookingContext";

interface PersonalInfoStepProps {
  data: BookingData;
  updateData: (updates: Partial<BookingData>) => void;
}

export default function PersonalInfoStep({ data, updateData }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <User className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Your Details</h3>
        <p className="text-muted-foreground">Please provide your contact information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              required
              value={data.fullName}
              onChange={(e) => updateData({ fullName: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              required
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <div className="flex">
              <select
                className="px-3 py-3 border border-border rounded-l-lg bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                defaultValue="+254"
              >
                <option value="+254">+254</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
              </select>
              <input
                type="tel"
                required
                value={data.phone}
                onChange={(e) => updateData({ phone: e.target.value })}
                className="flex-1 px-4 py-3 border border-border rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="712 345 678"
              />
            </div>
          </div>
        </div>

        {/* Company */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Company/Organization <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={data.company}
              onChange={(e) => updateData({ company: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Acme Corporation"
            />
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <p className="text-sm text-purple-700">
          <strong>Privacy Note:</strong> Your information is kept confidential and will only be used to respond to your booking request.
        </p>
      </div>
    </div>
  );
}

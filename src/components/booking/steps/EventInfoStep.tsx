"use client";

import { Calendar, Clock, Users, MapPin, Tag } from "lucide-react";
import { BookingData } from "../BookingContext";

interface EventInfoStepProps {
  data: BookingData;
  updateData: (updates: Partial<BookingData>) => void;
}

export default function EventInfoStep({ data, updateData }: EventInfoStepProps) {
  const eventTypes = [
    { value: "corporate", label: "Corporate Event" },
    { value: "wedding", label: "Wedding" },
    { value: "conference", label: "Conference" },
    { value: "concert", label: "Concert/Festival" },
    { value: "private", label: "Private Party" },
    { value: "virtual", label: "Virtual Event" },
    { value: "other", label: "Other" },
  ];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Event Details</h3>
        <p className="text-muted-foreground">Tell us about your event</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Event Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <select
              required
              value={data.eventType}
              onChange={(e) => updateData({ eventType: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="">Select event type</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={data.eventName}
            onChange={(e) => updateData({ eventName: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Annual Company Gala"
          />
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Event Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="date"
              required
              min={getMinDate()}
              value={data.eventDate}
              onChange={(e) => updateData({ eventDate: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Expected Attendees */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Expected Attendees <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="number"
              required
              min="1"
              value={data.expectedAttendees || ""}
              onChange={(e) => updateData({ expectedAttendees: parseInt(e.target.value) || 0 })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="100"
            />
          </div>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="time"
              required
              value={data.startTime}
              onChange={(e) => updateData({ startTime: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            End Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="time"
              required
              value={data.endTime}
              onChange={(e) => updateData({ endTime: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Venue/Location */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Venue/Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              required
              value={data.venue}
              onChange={(e) => updateData({ venue: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Safari Park Hotel, Nairobi"
            />
          </div>
        </div>

        {/* Venue Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Venue Address <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <textarea
            value={data.venueAddress}
            onChange={(e) => updateData({ venueAddress: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            placeholder="Kenyatta Avenue, Nairobi, Kenya"
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <p className="text-sm text-purple-700">
          <strong>Tip:</strong> Provide accurate event details to help us prepare the best equipment and team for your event.
        </p>
      </div>
    </div>
  );
}

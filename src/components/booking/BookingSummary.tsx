"use client";

import { useFormContext, useWatch } from 'react-hook-form'
import { Phone, Mail, MessageCircle, CheckCircle, Clock, Calendar, MapPin, Users, Star } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card'
import type { BookingFormValues } from '@/src/lib/booking/schema'
import { SERVICES } from '@/src/lib/booking/constants'
import { cn } from '@/src/lib/utils'

// Service pricing (update these to match your actual pricing)
const SERVICE_PRICES: Record<string, number> = {
  'live-streaming': 1500,
  'event-coverage': 2000,
  'photography': 800,
  'corporate-video': 1200,
  'graphic-design': 500,
  'sound-setup': 1000,
  'stage-lighting': 1500,
  'interpretation': 800,
  'social-media': 600,
  'hybrid-conferencing': 1200,
}

const CONTACT_OPTIONS = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '+254 712 345 678',
    href: 'tel:+254712345678',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'bookings@silverlinebrilliance.com',
    href: 'mailto:bookings@silverlinebrilliance.com',
  },
  {
    icon: MessageCircle,
    label: 'Live Chat',
    value: 'Available 9AM-6PM',
    href: '#',
  },
] as const

const TRUST_ITEMS = [
  'Free initial consultation',
  'Flexible payment options',
  'Professional equipment',
  'Experienced team',
] as const

export function BookingSummary() {
  const { control } = useFormContext<BookingFormValues>()
  
  // Watch form values for live updates
  const eventName = useWatch({ control, name: 'eventName' })
  const eventDate = useWatch({ control, name: 'eventDate' })
  const eventStartTime = useWatch({ control, name: 'eventStartTime' })
  const eventEndTime = useWatch({ control, name: 'eventEndTime' })
  const venueName = useWatch({ control, name: 'venueName' })
  const expectedAttendees = useWatch({ control, name: 'expectedAttendees' })
  const selectedServices = useWatch({ control, name: 'selectedServices' }) ?? []

  // Calculate pricing
  const subtotal = selectedServices.reduce((total, serviceId) => {
    return total + (SERVICE_PRICES[serviceId] || 0)
  }, 0)

  const tax = Math.round(subtotal * 0.16) // 16% VAT
  const total = subtotal + tax

  const selectedServiceNames = SERVICES
    .filter((s) => selectedServices.includes(s.id))
    .map((s) => s.name)

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="space-y-5">

      {/* Booking Summary Card */}
      <Card className="border-purple-500/20 bg-slate-900/70 backdrop-blur-sm">
        <CardHeader className="border-b border-purple-500/20 pb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            <h3 className="text-lg font-bold text-white">Booking Summary</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          
          {/* Event Name */}
          {eventName && (
            <div>
              <h4 className="text-base font-semibold text-white">{eventName}</h4>
            </div>
          )}

          {/* Event Details */}
          <div className="space-y-2.5 text-sm">
            {formattedDate && (
              <div className="flex items-start gap-2.5 text-purple-200">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                <span>{formattedDate}</span>
              </div>
            )}

            {(eventStartTime || eventEndTime) && (
              <div className="flex items-start gap-2.5 text-purple-200">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                <span>
                  {eventStartTime || '—'} {eventEndTime && `– ${eventEndTime}`}
                </span>
              </div>
            )}

            {venueName && (
              <div className="flex items-start gap-2.5 text-purple-200">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                <span>{venueName}</span>
              </div>
            )}

            {expectedAttendees > 0 && (
              <div className="flex items-start gap-2.5 text-purple-200">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                <span>{expectedAttendees.toLocaleString()} attendees</span>
              </div>
            )}
          </div>

          {/* Selected Services */}
          {selectedServiceNames.length > 0 && (
            <div className="border-t border-purple-500/20 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-300">
                Selected Services:
              </p>
              <ul className="space-y-1.5">
                {selectedServiceNames.map((name) => (
                  <li key={name} className="flex items-start gap-2 text-sm text-purple-100">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" aria-hidden="true" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing */}
          {selectedServices.length > 0 && (
            <div className="space-y-2 border-t border-purple-500/20 pt-4">
              <div className="flex justify-between text-sm text-purple-200">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-purple-200">
                <span>Tax (16%):</span>
                <span>${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-purple-500/20 pt-2 text-base font-bold">
                <span className="text-yellow-400">Total Estimate:</span>
                <span className="text-yellow-400">${total.toLocaleString()}</span>
              </div>
              <p className="text-xs italic text-purple-300">
                Final quote will be provided after review
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Need Help Card */}
      <Card className="border-purple-500/20 bg-slate-900/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <h3 className="text-base font-bold text-white">Need Help?</h3>
        </CardHeader>
        <CardContent className="space-y-2 pb-4">
          {CONTACT_OPTIONS.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg p-2.5 text-sm transition-colors',
                href === '#' 
                  ? 'cursor-default text-purple-300' 
                  : 'text-purple-200 hover:bg-purple-500/10 hover:text-purple-100'
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                <Icon className="h-4 w-4 text-purple-400" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-white">{label}</p>
                <p className="truncate text-xs text-purple-300">{value}</p>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Why Choose Us Card */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <h3 className="text-base font-bold text-white">Why Choose Us?</h3>
        </CardHeader>
        <CardContent className="pb-4">
          <ul className="space-y-2" aria-label="Our guarantees">
            {TRUST_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-purple-100">
                <CheckCircle className="h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

    </div>
  )
}

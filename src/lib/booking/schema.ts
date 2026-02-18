// lib/booking/schema.ts
import { z } from 'zod'

// ─────────────────────────────────────────────────────────────
// PHONE VALIDATION
// Accepts international formats: +254 712 345 678, (555) 123-4567, etc.
// ─────────────────────────────────────────────────────────────
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,14}[0-9]$/

// ─────────────────────────────────────────────────────────────
// MAIN BOOKING SCHEMA
// ─────────────────────────────────────────────────────────────
export const bookingSchema = z
  .object({
    // ── Step 1: Personal Information ──────────────────────────
    fullName: z
      .string({ message: 'Full name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),

    email: z
      .string({ message: 'Email address is required' })
      .email('Please enter a valid email address')
      .toLowerCase()
      .trim(),

    phone: z
      .string({ message: 'Phone number is required' })
      .regex(phoneRegex, 'Please enter a valid phone number (include country code)'),

    company: z
      .string()
      .max(100, 'Company name cannot exceed 100 characters')
      .trim()
      .optional()
      .or(z.literal('')),

    // ── Step 2: Event Information ─────────────────────────────
    eventType: z
      .string({ message: 'Please select an event type' })
      .min(1, 'Please select an event type'),

    eventTypeOther: z.string().trim().optional().or(z.literal('')),

    eventName: z
      .string({ message: 'Event name is required' })
      .min(3, 'Event name must be at least 3 characters')
      .max(150, 'Event name cannot exceed 150 characters')
      .trim(),

    eventDate: z
      .string({ message: 'Event date is required' })
      .refine((val) => {
        if (!val) return false
        const selected = new Date(val)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return selected >= today
      }, 'Event date must be today or in the future'),

    eventStartTime: z
      .string({ message: 'Start time is required' })
      .min(1, 'Start time is required'),

    eventEndTime: z.string().optional().or(z.literal('')),

    expectedAttendees: z
      .number({ message: 'Number of attendees is required' })
      .int('Must be a whole number')
      .min(1, 'Must have at least 1 attendee')
      .max(100000, 'Please contact us directly for events exceeding 100,000'),

    venueName: z
      .string({ message: 'Venue name is required' })
      .min(2, 'Venue name must be at least 2 characters')
      .max(200)
      .trim(),

    venueAddress: z
      .string()
      .max(300)
      .trim()
      .optional()
      .or(z.literal('')),

    // ── Step 3: Services ──────────────────────────────────────
    selectedServices: z
      .array(z.string())
      .min(1, 'Please select at least one service'),

    // ── Step 4: Additional Details ────────────────────────────
    specialRequirements: z
      .string()
      .max(2000, 'Requirements cannot exceed 2000 characters')
      .trim()
      .optional()
      .or(z.literal('')),

    budgetRange: z.string().optional().or(z.literal('')),

    howHeard: z.string().optional().or(z.literal('')),

    preferredContact: z
      .enum(['email', 'phone', 'whatsapp'], {
        message: 'Please select a contact method',
      })
      .optional()
      .default('email'),
  })
  // ── Cross-field / Conditional Rules ───────────────────────
  .superRefine((data, ctx) => {
    // eventTypeOther is required when eventType === 'Other'
    if (data.eventType === 'Other') {
      if (!data.eventTypeOther || data.eventTypeOther.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please describe your event type (min 3 characters)',
          path: ['eventTypeOther'],
        })
      }
    }

    // End time must be after start time when both provided
    if (data.eventStartTime && data.eventEndTime && data.eventEndTime.length > 0) {
      if (data.eventEndTime <= data.eventStartTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time must be after start time',
          path: ['eventEndTime'],
        })
      }
    }
  })

export type BookingFormValues = z.infer<typeof bookingSchema>

// ─────────────────────────────────────────────────────────────
// PER-STEP FIELD MAPS
// Used by BookingForm to validate only the current step's fields
// before allowing progression. This is the correct pattern for
// multi-step forms with RHF — never validate the entire schema
// on step advance, only the fields that belong to that step.
// ─────────────────────────────────────────────────────────────
export const STEP_FIELDS: Record<number, (keyof BookingFormValues)[]> = {
  1: ['fullName', 'email', 'phone'],
  2: ['eventType', 'eventTypeOther', 'eventName', 'eventDate', 'eventStartTime', 'expectedAttendees', 'venueName'],
  3: ['selectedServices'],
  4: ['preferredContact'],
}

// ─────────────────────────────────────────────────────────────
// QUICK QUOTE SCHEMA (lighter schema for the FAB modal)
// ─────────────────────────────────────────────────────────────
export const quickQuoteSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .trim(),
  email: z
    .string({ message: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase(),
  phone: z
    .string({ message: 'Phone number is required' })
    .regex(phoneRegex, 'Please enter a valid phone number'),
  service: z.string().optional().or(z.literal('')),
  eventDate: z
    .string()
    .refine((val) => {
      if (!val) return true // optional
      const selected = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selected >= today
    }, 'Date must be today or in the future')
    .optional()
    .or(z.literal('')),
  message: z.string().max(500).trim().optional().or(z.literal('')),
})

export type QuickQuoteValues = z.infer<typeof quickQuoteSchema>
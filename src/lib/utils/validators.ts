import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const bookingSchema = z.object({
  client_name: z.string().min(2, 'Client name is required'),
  client_email: z.string().email('Invalid email address'),
  client_phone: z.string().min(10, 'Phone number is required'),
  company_name: z.string().optional(),
  event_name: z.string().min(2, 'Event name is required'),
  event_type: z.string().min(2, 'Event type is required'),
  event_date: z.string().min(1, 'Event date is required'),
  event_start_time: z.string().min(1, 'Start time is required'),
  event_end_time: z.string().min(1, 'End time is required'),
  venue_location: z.string().min(2, 'Venue location is required'),
  venue_address: z.string().optional(),
  expected_attendees: z.number().positive().optional(),
  services: z.array(z.string()).min(1, 'At least one service is required'),
  special_requirements: z.string().optional(),
  budget_range: z.string().optional(),
  preferred_contact: z.string().optional(),
  referral_source: z.string().optional(),
});

export const blogPostSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  excerpt: z.string().max(160, 'Excerpt must be less than 160 characters').optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  publishedAt: z.string().optional(),
  seo: z.object({
    metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
    metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
    focusKeyword: z.string().optional(),
  }).optional(),
});

export const emailTemplateSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  body_html: z.string().min(1, 'Email body is required'),
  body_text: z.string().min(1, 'Plain text body is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type BlogPostFormData = z.infer<typeof blogPostSchema>;
export type EmailTemplateFormData = z.infer<typeof emailTemplateSchema>;

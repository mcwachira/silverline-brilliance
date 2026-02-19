// ============================================================
// SUPABASE — MERGED & EXTENDED
// ============================================================

// ✅ Combined both status unions
export type BookingStatus =
  | 'pending'
  | 'reviewing'
  | 'confirmed'
  | 'rejected'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'

// Added from second file
export type PaymentStatus =
  | 'unpaid'
  | 'deposit_paid'
  | 'fully_paid'

export type QuoteStatus = 'new' | 'contacted' | 'converted' | 'closed'
export type PreferredContact = 'email' | 'phone' | 'whatsapp'

// ------------------------------------------------------------
// Activity + Reschedule
// ------------------------------------------------------------

export interface RescheduleRecord {
  from_date: string
  to_date: string
  reason: string
  rescheduled_at: string
  rescheduled_by: string
}

export interface ActivityLogEntry {
  action: string
  performed_by: string
  performed_at: string
  details?: string
}

// ------------------------------------------------------------
// Booking (merged version)
// ------------------------------------------------------------

export interface Booking {
  id: string
  booking_reference: string

  // Contact
  full_name: string
  email: string
  phone: string
  company?: string

  // Event
  event_name: string
  event_type: string
  event_date: string
  event_start_time: string
  event_end_time?: string
  expected_attendees: number
  venue_name: string
  venue_address?: string

  // Services
  selected_services: string[]

  // Additional
  special_requirements?: string
  budget_range?: string
  how_heard?: string
  preferred_contact: PreferredContact

  // Pricing (NEW)
  price_total?: number
  price_deposit?: number
  payment_status?: PaymentStatus

  // Files (NEW)
  uploaded_files?: string[]

  // Rescheduling (NEW)
  reschedule_reason?: string
  reschedule_history?: RescheduleRecord[]

  // Activity log (NEW)
  activity_log?: ActivityLogEntry[]

  // Admin
  status: BookingStatus
  internal_notes?: string
  assigned_to?: string

  // Timestamps
  created_at: string
  updated_at: string
}

// ------------------------------------------------------------
// Newsletter (NEW)
// ------------------------------------------------------------

export interface Newsletter {
  id: string
  email: string
  subscribed_at: string
  status: 'active' | 'unsubscribed'
}

// ------------------------------------------------------------
// Quote Request (unchanged)
// ------------------------------------------------------------

export interface QuoteRequest {
  id: string
  reference: string
  name: string
  email: string
  phone: string
  service?: string
  event_date?: string
  message?: string
  status: QuoteStatus
  created_at: string
}

// ------------------------------------------------------------
// Admin Profile (merged)
// ------------------------------------------------------------

export interface AdminProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'admin' | 'super_admin'
  notification_settings?: {
    new_booking: boolean
    booking_cancelled: boolean
    email_digest: boolean
  }
  created_at: string
}

// ============================================================
// SANITY — MERGED SAFELY
// ============================================================

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

export interface SanitySlug {
  current: string
  _type?: 'slug'
}

export interface SanityAuthor {
  _id: string
  name: string
  slug: SanitySlug
  image?: SanityImage
  bio?: unknown[] | string
}

// Keeping your original schema shape
export interface SanityCategory {
  _id: string
  name?: string
  title?: string
  slug: SanitySlug
  description?: string
  color?: string
}

export interface SanityTag {
  _id: string
  title: string
  slug: SanitySlug
}

// ------------------------------------------------------------
// BlogPost (merged WITHOUT breaking yours)
// ------------------------------------------------------------

export type BlogPostStatus = 'draft' | 'published' | 'scheduled' | 'archived'

export interface BlogPost {
  _id: string
  _createdAt: string
  _updatedAt: string

  title: string
  slug: SanitySlug
  excerpt?: string

  // Support BOTH versions safely
  content?: unknown[]      // your schema
  body?: unknown[]         // second schema

  mainImage?: SanityImage
  featuredImage?: SanityImage

  author?: SanityAuthor
  categories?: SanityCategory[]
  tags?: string[] | SanityTag[]

  // Publishing
  publishedAt?: string
  scheduledAt?: string
  status?: BlogPostStatus

  // SEO (support both formats)
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage

  seo?: {
    metaTitle?: string
    metaDescription?: string
    focusKeyword?: string
  }

  views?: number
}

// Derived helper (improved to handle scheduled)

export function getBlogStatus(post: BlogPost): BlogPostStatus {
  if (post.status) return post.status
  if (post.scheduledAt) return 'scheduled'
  return post.publishedAt ? 'published' : 'draft'
}

// ============================================================
// QUOTE GENERATOR (unchanged)
// ============================================================

export type QuoteTemplate = 'classic' | 'modern' | 'minimal'

export interface QuoteLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface QuoteData {
  template: QuoteTemplate
  logoDataUrl?: string
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress?: string
  clientName: string
  clientEmail: string
  clientCompany?: string
  quoteNumber: string
  quoteDate: string
  validUntil?: string
  lineItems: QuoteLineItem[]
  taxRate: number
  discount?: number
  notes?: string
  paymentTerms?: string
}

export function computeQuoteTotals(
  items: QuoteLineItem[],
  taxRate: number,
  discount = 0
) {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const discountAmount = discount
  const taxable = Math.max(0, subtotal - discountAmount)
  const tax = (taxable * taxRate) / 100
  const total = taxable + tax
  return { subtotal, discountAmount, taxable, tax, total }
}

// ============================================================
// UI TYPES (extended)
// ============================================================

export interface TableColumn<T = unknown> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

export interface FilterState {
  search: string
  status?: BookingStatus | 'all'
  dateFrom?: string
  dateTo?: string
  serviceType?: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
}

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void
  onCancel: () => void
}

// ============================================================
// EMAIL TYPES (NEW)
// ============================================================

export interface EmailTemplate {
  to: strings
  subject: string
  html: string
  text?: string
}

export type EmailEvent =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_rescheduled'
  | 'booking_cancelled'
  | 'booking_completed'

export interface EmailPayload {
  event: EmailEvent
  booking: Booking
  adminEmail?: string
}

// ============================================================
// Blog Edit Page
// ============================================================
export type PostFormData = {
  title: string
  slug: string
  excerpt: string
  authorId: string
  categoryIds: string[]
  tags: string[]
  metaTitle: string
  metaDescription: string
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
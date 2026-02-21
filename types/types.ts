// ============================================================
// SUPABASE — BOOKING / FORM TYPES
// ============================================================

/**
 * Re-export canonical BookingStatus from types/admin.ts so the rest
 * of the app only needs one import source.
 */
export type { BookingStatus, AdminProfile } from "./admin";

export type PaymentStatus = "unpaid" | "deposit_paid" | "fully_paid";

/**
 * Lead/CRM status for a QuoteRequest form submission.
 * NOT the same as QuoteDocumentStatus (the full quote lifecycle).
 */
export type QuoteRequestStatus = "new" | "contacted" | "converted" | "closed"; // ✅ Renamed from QuoteStatus

export type PreferredContact = "email" | "phone" | "whatsapp";

// ─── Booking field helpers ────────────────────────────────────────────────────

export interface RescheduleRecord {
  from_date: string;
  to_date: string;
  reason: string;
  rescheduled_at: string;
  rescheduled_by: string;
}

export interface ActivityLogEntry {
  action: string;
  performed_by: string;
  performed_at: string;
  details?: string;
}

// ─── Booking (public-facing form / DB extended shape) ─────────────────────────

/**
 * Extended booking row shape — includes public booking form fields.
 * The admin-only view of a booking lives in types/admin.ts → Booking.
 * If your DB has a single bookings table serving both, align them and
 * use types/admin.ts Booking as the single source of truth.
 */
export interface Booking {
  id: string;
  booking_reference: string;

  // Contact
  full_name: string;
  email: string;
  phone: string;
  company: string | null;

  // Event
  event_name: string;
  event_type: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string | null;
  expected_attendees: number;
  venue_name: string;
  venue_address: string | null;

  // Services
  selected_services: string[];

  // Additional
  special_requirements: string | null;
  budget_range: string | null;
  how_heard: string | null;
  preferred_contact: PreferredContact; // ✅ Was `string`, narrowed to the union

  // Pricing
  price_total?: number;
  price_deposit?: number;
  payment_status?: PaymentStatus;

  // Files
  uploaded_files?: string[];

  // Rescheduling
  reschedule_reason?: string;
  reschedule_history?: RescheduleRecord[];

  // Activity log
  activity_log?: ActivityLogEntry[];

  // Admin
  status: import("./admin").BookingStatus; // ✅ Reuse canonical type
  internal_notes: string | null;
  assigned_to: string | null;

  created_at: string;
  updated_at: string;
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export interface Newsletter {
  id: string;
  email: string;
  subscribed_at: string;
  status: "active" | "unsubscribed";
}

// ─── Quote Request (lead form) ────────────────────────────────────────────────

export interface QuoteRequest {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  service?: string;
  event_date?: string;
  message?: string;
  status: QuoteRequestStatus; // ✅ Updated ref
  created_at: string;
}

// ============================================================
// SANITY — CMS TYPES
// ============================================================

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
}

export interface SanitySlug {
  current: string;
  _type?: "slug";
}

export interface SanityAuthor {
  _id: string;
  name: string;
  slug: SanitySlug;
  image?: SanityImage;
  bio?: unknown[] | string;
}

export interface SanityCategory {
  _id: string;
  name?: string;
  title?: string;
  slug: SanitySlug;
  description?: string;
  color?: string;
}

export interface SanityTag {
  _id: string;
  title: string;
  slug: SanitySlug;
}

export type BlogPostStatus = "draft" | "published" | "scheduled" | "archived";

/**
 * Sanity CMS blog post document.
 * For the Supabase blog_posts table row, see types/admin.ts → SupabaseBlogPost.
 */
export interface BlogPost { // This is the Sanity version — keep the name here
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  content?: unknown[];
  body?: unknown[];
  mainImage?: SanityImage;
  featuredImage?: SanityImage;
  author?: SanityAuthor;
  categories?: SanityCategory[];
  tags?: string[] | SanityTag[];
  publishedAt?: string;
  scheduledAt?: string;
  status?: BlogPostStatus;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
  };
  views?: number;
}

export function getBlogStatus(post: BlogPost): BlogPostStatus {
  if (post.status) return post.status;
  if (post.scheduledAt) return "scheduled";
  return post.publishedAt ? "published" : "draft";
}

// ============================================================
// QUOTE GENERATOR
// ============================================================

export type QuoteTemplate = "classic" | "modern" | "minimal";

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteData {
  template: QuoteTemplate;
  logoDataUrl?: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress?: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  quoteNumber: string;
  quoteDate: string;
  validUntil?: string;
  lineItems: QuoteLineItem[];
  taxRate: number;
  discount?: number;
  notes?: string;
  paymentTerms?: string;
}

export function computeQuoteTotals(
  items: QuoteLineItem[],
  taxRate: number,
  discount = 0
) {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const discountAmount = discount;
  const taxable = Math.max(0, subtotal - discountAmount);
  const tax = (taxable * taxRate) / 100;
  const total = taxable + tax;
  return { subtotal, discountAmount, taxable, tax, total };
}

// ============================================================
// UI TYPES
// ============================================================

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface FilterState {
  search: string;
  status?: import("./admin").BookingStatus | "all"; // ✅ Uses canonical type
  dateFrom?: string;
  dateTo?: string;
  serviceType?: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
}

// ============================================================
// EMAIL TYPES
// ============================================================

/**
 * Outbound email payload passed to the email sender.
 * For stored DB template rows, see types/admin.ts → AdminEmailTemplate.
 */
export interface OutboundEmail { // ✅ Renamed from EmailTemplate — was colliding with admin.ts
  to: string;        // ✅ Fixed: was `strings` (TypeScript syntax error)
  subject: string;
  html: string;
  text?: string;
}

export type EmailEvent =
  | "booking_created"
  | "booking_confirmed"
  | "booking_rescheduled"
  | "booking_cancelled"
  | "booking_completed";

export interface EmailPayload {
  event: EmailEvent;
  booking: Booking;
  adminEmail?: string;
}

// ============================================================
// Blog Edit Page
// ============================================================

export type PostFormData = {
  title: string;
  slug: string;
  excerpt: string;
  authorId: string;
  categoryIds: string[];
  tags: string[];
  metaTitle: string;
  metaDescription: string;
};

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
// ─── Primitive Unions ─────────────────────────────────────────────────────────

/**
 * All possible booking lifecycle states.
 * Canonical — import BookingStatus from here, not from types/types.ts
 */
export type BookingStatus =
  | "pending"
  | "reviewing"
  | "confirmed"
  | "completed"
  | "rejected"
  | "cancelled"      // ✅ Added — was missing
  | "rescheduled";   // ✅ Added — was missing

/**
 * Quote document lifecycle (draft → sent → accepted/rejected/expired).
 * NOT the same as QuoteRequest lead status — see types/types.ts QuoteRequestStatus.
 */
export type QuoteDocumentStatus =  // ✅ Renamed from QuoteStatus to avoid collision with types/types.ts
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export type BlogPostStatus = "draft" | "published" | "scheduled" | "archived"; // ✅ Added "archived"

// ─── Quote ───────────────────────────────────────────────────────────────────

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  reference: string;
  status: QuoteDocumentStatus; // ✅ Updated ref
  company_name: string;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  company_logo_url: string | null;
  client_name: string;
  client_email: string | null;
  client_company: string | null;
  template: "classic" | "modern" | "minimal";
  quote_number: string;
  issue_date: string;
  valid_until: string | null;
  line_items: QuoteLineItem[];
  discount: number;
  tax: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  payment_terms: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Admin User / Profile ─────────────────────────────────────────────────────

/**
 * A user that can log into the admin panel.
 * Distinct from AdminProfile (which is the extended settings record).
 */
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "super_admin" | "editor" | "author"; // ✅ Kept editor/author — valid for blog roles
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export interface NotificationSettings {
  new_booking: boolean;
  booking_confirmed: boolean;
  booking_cancelled: boolean; // ✅ Added — was in types/types.ts but missing here
  new_message: boolean;
  email_digest: boolean;
}

export interface AdminProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  role: "admin" | "super_admin";
  notification_settings?: NotificationSettings; // ✅ Made optional — DB row might not have it yet
  created_at: string;
  updated_at: string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

/**
 * Supabase `bookings` table row shape.
 * Field names reflect the actual DB columns.
 */
export interface Booking {
  id: string;
  reference: string;
  status: BookingStatus;

  // Client
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_company: string | null;

  // Event
  event_name: string;
  event_type: string;
  event_date: string;           // ISO date string
  event_end_date: string | null;
  venue: string | null;
  attendees: number | null;

  // Services
  services: string[];

  // Internal
  admin_notes: string | null;
  quote_id: string | null;

  created_at: string;
  updated_at: string;
}

// ─── Blog Post (Supabase) ─────────────────────────────────────────────────────

/**
 * Supabase `blog_posts` table row.
 * For the Sanity CMS BlogPost shape, see types/types.ts → SanityBlogPost.
 */
export interface SupabaseBlogPost { // ✅ Renamed to avoid collision with Sanity BlogPost in types/types.ts
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  status: BlogPostStatus;
  published_at: string | null;
  scheduled_at: string | null;
  author_name: string;
  categories: string[];
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  total_bookings: number;
  bookings_this_month: number;
  pending_bookings: number;
  confirmed_bookings: number;
  total_quotes: number;
  accepted_quotes: number;
  total_quote_value: number;
  published_posts: number;
  unread_messages: number;
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  type: "booking" | "quote" | "message" | "blog"; // ✅ Was just `string` implicitly — now explicit literal union
  action: string;
  subject: string;
  status?: string;
  created_at: string;
}

// ─── Server Action Result ─────────────────────────────────────────────────────

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Email (Admin DB Template) ────────────────────────────────────────────────

/**
 * A stored email template row in the DB.
 * For the outbound email payload shape, see types/types.ts → OutboundEmail.
 */
export interface AdminEmailTemplate { // ✅ Renamed — was colliding with types/types.ts EmailTemplate
  id: string;
  template_name: string;
  template_type: string;
  subject: string;
  body_html: string;
  body_text: string;
  variables?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string;
  filename: string;
  original_filename: string;
  file_url: string;
  file_type: string;
  mime_type?: string;
  file_size?: number;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  uploaded_by?: string;
  uploaded_at: string;
  folder?: string;
  tags?: string[];
}
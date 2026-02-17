// lib/booking/constants.ts
// ─────────────────────────────────────────────────────────────
// Single source of truth for all booking form configuration.
// Imported by: schema, steps, summary, server action, admin dashboard.
// Never duplicate these arrays in individual components.
// ─────────────────────────────────────────────────────────────

export interface Service {
  id: string
  name: string
  description: string
  icon: string // lucide icon name
}

export const SERVICES: Service[] = [
  {
    id: 'live-streaming',
    name: 'Live Streaming',
    description: 'Multi-camera live streaming to any platform',
    icon: 'Video',
  },
  {
    id: 'event-coverage',
    name: 'Event Coverage',
    description: 'Full event documentation with video and photo',
    icon: 'Camera',
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'High-quality event and corporate photography',
    icon: 'ImageIcon',
  },
  {
    id: 'corporate-video',
    name: 'Corporate Video',
    description: 'Professional video production for corporate events',
    icon: 'Film',
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    description: 'Event branding, banners, and visual materials',
    icon: 'Palette',
  },
  {
    id: 'sound-setup',
    name: 'Sound Setup',
    description: 'Professional PA systems and audio engineering',
    icon: 'Volume2',
  },
  {
    id: 'stage-lighting',
    name: 'Stage & Lighting',
    description: 'Stage design and professional lighting rigs',
    icon: 'Lightbulb',
  },
  {
    id: 'interpretation',
    name: 'Interpretation Services',
    description: 'Simultaneous interpretation with professional equipment',
    icon: 'Languages',
  },
  {
    id: 'social-media',
    name: 'Social Media Content',
    description: 'Real-time social media content creation',
    icon: 'Share2',
  },
  {
    id: 'hybrid-conferencing',
    name: 'Hybrid Conferencing',
    description: 'Seamless hybrid event and conferencing solutions',
    icon: 'Monitor',
  },
] as const

export const EVENT_TYPES = [
  'Corporate Event',
  'Wedding',
  'Conference',
  'Concert / Festival',
  'Private Party',
  'Virtual Event',
  'Product Launch',
  'Awards Ceremony',
  'Other',
] as const

export const BUDGET_RANGES = [
  'Under $1,000',
  '$1,000 – $5,000',
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000+',
  'Contact me for a custom quote',
] as const

export const HOW_HEARD_OPTIONS = [
  'Google Search',
  'Social Media',
  'Referral from a client',
  'Previous client',
  'Advertisement',
  'Other',
] as const

export const PREFERRED_CONTACT_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'whatsapp', label: 'WhatsApp' },
] as const

// Step configuration — controls which fields are validated per step
export const STEP_LABELS = [
  'Your Details',
  'Event Info',
  'Services',
  'Final Details',
] as const

export const TOTAL_STEPS = STEP_LABELS.length
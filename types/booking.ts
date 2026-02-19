export interface Booking {
  id: string;
  booking_reference: string;
  
  // Client Info
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  
  // Event Info
  event_name: string;
  event_type: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string | null;
  venue_name: string;
  venue_address: string | null;
  expected_attendees: number;
  
  // Services
  selected_services: string[];
  special_requirements: string | null;
  budget_range: string | null;
  
  // Status
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  
  // Metadata
  preferred_contact: string;
  how_heard: string | null;
  assigned_to: string | null;
  internal_notes: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface BookingHistory {
  id: string;
  booking_id: string;
  action_type: string;
  action_description: string;
  old_value?: any;
  new_value?: any;
  performed_by?: string;
  performed_at: string;
  metadata?: any;
}

export interface Booking {
  id: string;
  booking_reference: string;
  
  // Client Info
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name?: string;
  
  // Event Info
  event_name: string;
  event_type: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string;
  venue_location: string;
  venue_address?: string;
  expected_attendees?: number;
  
  // Services
  services: string[];
  special_requirements?: string;
  budget_range?: string;
  
  // Status
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  
  // Metadata
  preferred_contact?: string;
  referral_source?: string;
  file_uploads?: any[];
  admin_notes?: string;
  
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

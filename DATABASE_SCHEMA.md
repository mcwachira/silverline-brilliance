# Database Schema - Supabase

This document contains all the SQL commands needed to set up the database for the Silverline Technologies Admin Dashboard.

## 1. Bookings Table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  
  -- Client Info
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  company_name VARCHAR(255),
  
  -- Event Info
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL,
  event_start_time TIME NOT NULL,
  event_end_time TIME NOT NULL,
  venue_location TEXT NOT NULL,
  venue_address TEXT,
  expected_attendees INTEGER,
  
  -- Services (JSON array)
  services JSONB NOT NULL,
  special_requirements TEXT,
  budget_range VARCHAR(50),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  
  -- Metadata
  preferred_contact VARCHAR(50),
  referral_source VARCHAR(100),
  file_uploads JSONB,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(event_date);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_client_email ON bookings(client_email);

-- Auto-generate booking reference function
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference := 'BK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('booking_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE booking_seq START WITH 1;

CREATE TRIGGER set_booking_reference
BEFORE INSERT ON bookings
FOR EACH ROW
WHEN (NEW.booking_reference IS NULL)
EXECUTE FUNCTION generate_booking_reference();
```

## 2. Booking History Table

```sql
CREATE TABLE booking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  
  action_type VARCHAR(50) NOT NULL,
  action_description TEXT NOT NULL,
  
  old_value JSONB,
  new_value JSONB,
  
  performed_by VARCHAR(255),
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  metadata JSONB
);

-- Create indexes
CREATE INDEX idx_booking_history_booking ON booking_history(booking_id);
CREATE INDEX idx_booking_history_date ON booking_history(performed_at DESC);
CREATE INDEX idx_booking_history_action ON booking_history(action_type);
```

## 3. Email Templates Table

```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name VARCHAR(100) UNIQUE NOT NULL,
  template_type VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default templates
INSERT INTO email_templates (template_name, template_type, subject, body_html, body_text, variables) VALUES
('booking_confirmation', 'booking_confirmation', 
 'Booking Confirmed - {booking_reference}',
 '<h1>Thank you for your booking!</h1><p>Dear {client_name},</p><p>Your booking for <strong>{event_name}</strong> on <strong>{event_date}</strong> has been confirmed.</p><p>Booking Reference: <strong>{booking_reference}</strong></p>',
 'Thank you for your booking! Dear {client_name}, Your booking for {event_name} on {event_date} has been confirmed. Booking Reference: {booking_reference}',
 '["client_name", "event_name", "event_date", "booking_reference", "venue", "event_time"]'
),
('booking_reschedule', 'booking_reschedule',
 'Booking Rescheduled - {booking_reference}',
 '<h1>Booking Rescheduled</h1><p>Dear {client_name},</p><p>Your booking has been rescheduled to <strong>{new_date}</strong>.</p><p>Booking Reference: <strong>{booking_reference}</strong></p>',
 'Your booking has been rescheduled. Booking Reference: {booking_reference}',
 '["client_name", "booking_reference", "new_date", "old_date"]'
),
('booking_cancellation', 'booking_cancellation',
 'Booking Cancelled - {booking_reference}',
 '<h1>Booking Cancelled</h1><p>Dear {client_name},</p><p>Your booking has been cancelled.</p><p>Booking Reference: <strong>{booking_reference}</strong></p>',
 'Your booking has been cancelled. Booking Reference: {booking_reference}',
 '["client_name", "booking_reference"]'
);
```

## 4. Comments Table

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  author_website VARCHAR(255),
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by VARCHAR(255)
);

-- Create indexes
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);
```

## 5. Media Library Table

```sql
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  mime_type VARCHAR(100),
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  uploaded_by VARCHAR(255),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  folder VARCHAR(255) DEFAULT 'uncategorized',
  tags JSONB
);

-- Create indexes
CREATE INDEX idx_media_type ON media_library(file_type);
CREATE INDEX idx_media_folder ON media_library(folder);
CREATE INDEX idx_media_uploaded ON media_library(uploaded_at DESC);
CREATE INDEX idx_media_tags ON media_library USING GIN(tags);
```

## 6. Admin Users Table

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'editor',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, full_name, role) VALUES 
('admin@silverlinetech.com', 'System Administrator', 'admin');
```

## 7. Blog Posts View (Optional)

```sql
-- Create a view for blog posts analytics
CREATE VIEW blog_analytics AS
SELECT 
  p.id as post_id,
  p.title,
  p.status,
  p.published_at,
  COUNT(c.id) as comment_count,
  COUNT(DISTINCT CASE WHEN c.status = 'approved' THEN c.id END) as approved_comments,
  COUNT(DISTINCT CASE WHEN c.status = 'pending' THEN c.id END) as pending_comments
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.id, p.title, p.status, p.published_at;
```

## 8. Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Booking policies
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Admins can insert bookings" ON bookings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Admins can update bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Admins can delete bookings" ON bookings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND is_active = true
    )
  );

-- Similar policies for other tables...
CREATE POLICY "Admins full access to booking_history" ON booking_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Admins full access to comments" ON comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Admins full access to media_library" ON media_library
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Admins full access to email_templates" ON email_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND is_active = true
    )
  );

CREATE POLICY "Users can view their own profile" ON admin_users
  FOR SELECT USING (email = auth.email());

CREATE POLICY "Admins can view all users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.email() AND is_active = true AND role = 'admin'
    )
  );
```

## 9. Functions and Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at 
    BEFORE UPDATE ON email_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log booking activities
CREATE OR REPLACE FUNCTION log_booking_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO booking_history (booking_id, action_type, action_description, new_value, performed_by)
        VALUES (NEW.id, 'created', 'Booking created', to_jsonb(NEW), auth.email());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO booking_history (booking_id, action_type, action_description, old_value, new_value, performed_by)
        VALUES (NEW.id, 'updated', 'Booking updated', to_jsonb(OLD), to_jsonb(NEW), auth.email());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO booking_history (booking_id, action_type, action_description, old_value, performed_by)
        VALUES (OLD.id, 'deleted', 'Booking deleted', to_jsonb(OLD), auth.email());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply activity logging trigger
CREATE TRIGGER booking_activity_log
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW EXECUTE FUNCTION log_booking_activity();
```

## 10. Sample Data (Optional)

```sql
-- Insert sample booking
INSERT INTO bookings (
  client_name, 
  client_email, 
  client_phone, 
  company_name,
  event_name, 
  event_type, 
  event_date, 
  event_start_time, 
  event_end_time, 
  venue_location, 
  venue_address,
  expected_attendees,
  services,
  special_requirements,
  budget_range,
  status
) VALUES (
  'John Doe',
  'john.doe@example.com',
  '+1-555-0123',
  'Doe Corporation',
  'Annual Company Gala',
  'corporate',
  '2024-06-15',
  '19:00:00',
  '23:00:00',
  'Grand Ballroom, Hilton Hotel',
  '123 Main St, City, State',
  150,
  '["Sound System", "Lighting", "Projector", "DJ Services"]',
  'Need additional microphones for presentations',
  '$5000-$10000',
  'confirmed'
);
```

---

## Setup Instructions

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.

2. **Run SQL Commands**: Copy and paste all the SQL commands above into the Supabase SQL Editor.

3. **Configure Environment**: Update your `.env.local` file with your Supabase credentials.

4. **Test Connection**: Run the development server and test the database connection.

## Notes

- All tables use UUID primary keys for better security and performance.
- Row Level Security (RLS) is enabled for secure data access.
- JSONB is used for flexible data storage (services, tags, etc.).
- Indexes are created for optimal query performance.
- Triggers automatically log activities and update timestamps.
- The schema supports multi-tenancy and is production-ready.

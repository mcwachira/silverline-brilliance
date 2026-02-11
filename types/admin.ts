export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'author';
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export interface EmailTemplate {
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

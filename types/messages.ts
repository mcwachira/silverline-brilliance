// types/messages.ts

export type MessageStatus = "unread" | "read" | "replied" | "archived";

export interface ContactMessage {
  id: string;
  reference: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  service: string | null;
  how_heard: string | null;
  status: MessageStatus;
  admin_notes: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageCounts {
  all: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
}
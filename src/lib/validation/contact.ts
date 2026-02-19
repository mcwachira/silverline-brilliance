import { z } from "zod";

export const ContactSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).optional().or(z.literal("")),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(3000),
  service: z.string().optional(),
  how_heard: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof ContactSchema>;
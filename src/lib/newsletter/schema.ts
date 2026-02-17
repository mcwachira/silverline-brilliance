import { z } from 'zod'

export const newsletterSchema = z.object({
  email: z
    .string({ message: 'Email address is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
})

export type NewsletterFormValues = z.infer<typeof newsletterSchema>
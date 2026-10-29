import { z } from 'zod'

export const FIELD_NAMES = ['name', 'email', 'phoneNumber'] as const

export const contactDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200, 'Max 200 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Enter a 10-digit phone number'),
})

export type ContactDetailsFormValues = z.infer<typeof contactDetailsSchema>

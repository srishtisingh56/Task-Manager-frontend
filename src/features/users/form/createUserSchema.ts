import { z } from 'zod'

export const FIELD_NAMES = ['name', 'email', 'phoneNumber', 'password'] as const

export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200, 'Max 200 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Enter a 10-digit phone number'),
  password: z.string().min(8, 'At least 8 characters').max(72, 'Max 72 characters'),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>

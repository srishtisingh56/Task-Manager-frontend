import { z } from 'zod'

export const FIELD_NAMES = [
    'title',
    'description',
    'priority',
    'lenientDeadline',
    'strictDeadline',
    'isRepetitive',
    'assignedToUserId'
] as const

export function makeTaskFormSchema(initialStrict?: string) {
  return z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Max 200 characters'),
    description: z.string().max(1000, 'Max 1000 characters'),
    priority: z.enum(['', 'Low', 'Medium', 'High', 'Critical']), // '' = none
    lenientDeadline: z.string().min(1, 'Lenient deadline is required'),
    strictDeadline: z.string().min(1, 'Strict deadline is required'),
    isRepetitive: z.boolean(),
    assignedToUserId: z.string().min(1, 'Choose an assignee'),
  })
  .superRefine((v,ctx)=>{
    const lenient = new Date(v.lenientDeadline);
    const strict = new Date(v.strictDeadline);
    if (strict <= lenient) {
      ctx.addIssue({
        code: 'custom',
        path: ['strictDeadline'],
        message: 'Strict deadline must be after the lenient deadline',
      });
    }
    else if(v.strictDeadline !== initialStrict && strict<= new Date()){
        ctx.addIssue({
          code: 'custom',
          path: ['strictDeadline'],
          message: 'Strict deadline must be in the future',
        });
    }
  })
}
export type TaskFormValues = z.infer<ReturnType<typeof makeTaskFormSchema>>
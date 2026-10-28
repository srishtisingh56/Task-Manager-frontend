import { z } from 'zod'
import type { NotificationOffsetUnit, NotificationRepeatMode } from '@/types/api'
import type { RuleTriggerEvent } from '../types'

export const FIELD_NAMES = ['triggerEvent', 'offsetValue', 'offsetUnit', 'repeatMode'] as const

export const TRIGGER_EVENT_OPTIONS: { label: string; value: RuleTriggerEvent }[] = [
  { label: 'After creation', value: 'AfterCreationOffset' },
  { label: 'Before lenient deadline', value: 'BeforeLenientDeadline' },
  { label: 'Before strict deadline', value: 'BeforeStrictDeadline' },
]

export const OFFSET_UNIT_OPTIONS: NotificationOffsetUnit[] = ['Minutes', 'Hours', 'Days', 'Weeks']
export const REPEAT_MODE_OPTIONS: NotificationRepeatMode[] = ['Once', 'Repeating']

export const ruleFormSchema = z
  .object({
    triggerEvent: z.enum(['AfterCreationOffset', 'BeforeLenientDeadline', 'BeforeStrictDeadline']),
    offsetValue: z.number().int().positive('Must be a positive number'),
    offsetUnit: z.enum(['Minutes', 'Hours', 'Days', 'Weeks']),
    repeatMode: z.enum(['Once', 'Repeating']),
  })
  // Only AfterCreationOffset may repeat; deadline-warning triggers are always Once (domain_layer.md §3).
  .superRefine((v, ctx) => {
    if (v.repeatMode === 'Repeating' && v.triggerEvent !== 'AfterCreationOffset') {
      ctx.addIssue({
        code: 'custom',
        path: ['repeatMode'],
        message: 'Only "After creation" reminders can repeat.',
      })
    }
  })

export type RuleFormValues = z.infer<typeof ruleFormSchema>

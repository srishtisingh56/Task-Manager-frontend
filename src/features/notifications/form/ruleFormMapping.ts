import type { RuleFormValues } from './ruleFormSchema'
import type { CreateNotificationRuleBody, NotificationRule, UpdateScheduleBody } from '../types'

export type DirtyFields = Partial<Record<keyof RuleFormValues, boolean>>

export function emptyRuleForm(): RuleFormValues {
  return { triggerEvent: 'AfterCreationOffset', offsetValue: 1, offsetUnit: 'Hours', repeatMode: 'Once' }
}

export function ruleToFormValues(rule: NotificationRule): RuleFormValues {
  return {
    triggerEvent: rule.triggerEvent,
    offsetValue: rule.offsetValue ?? 1,
    offsetUnit: rule.offsetUnit ?? 'Hours',
    repeatMode: rule.repeatMode,
  }
}

export function toCreateBody(v: RuleFormValues): CreateNotificationRuleBody {
  return {
    triggerEvent: v.triggerEvent,
    offsetValue: v.offsetValue,
    offsetUnit: v.offsetUnit,
    repeatMode: v.repeatMode,
  }
}

export function buildUpdateBody(v: RuleFormValues, dirty: DirtyFields): UpdateScheduleBody {
  const body: UpdateScheduleBody = {}
  if (dirty.offsetValue) body.offsetValue = v.offsetValue
  if (dirty.offsetUnit) body.offsetUnit = v.offsetUnit
  if (dirty.repeatMode) body.repeatMode = v.repeatMode
  return body
}

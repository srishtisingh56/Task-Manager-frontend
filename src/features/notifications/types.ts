import type { NotificationOffsetUnit, NotificationRepeatMode } from '@/types/api'

// Only these 3 trigger events can have a NotificationRule; the rest are immediate/system events.
export type RuleTriggerEvent = 'AfterCreationOffset' | 'BeforeLenientDeadline' | 'BeforeStrictDeadline'

export interface NotificationRule {
  id: string
  taskId: string
  triggerEvent: RuleTriggerEvent
  offsetValue: number | null
  offsetUnit: NotificationOffsetUnit | null
  repeatMode: NotificationRepeatMode
}

export interface CreateNotificationRuleBody {
  triggerEvent: RuleTriggerEvent
  offsetValue: number | null
  offsetUnit: NotificationOffsetUnit | null
  repeatMode: NotificationRepeatMode
}

// TriggerEvent is omitted: backend allows it but it isn't mutable in practice (application_layer.md §4).
export interface UpdateScheduleBody {
  offsetValue?: number | null
  offsetUnit?: NotificationOffsetUnit | null
  repeatMode?: NotificationRepeatMode
}

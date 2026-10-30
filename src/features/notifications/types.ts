import type {
  NotificationChannel, NotificationDeliveryStatus, NotificationOffsetUnit, NotificationRepeatMode,
  NotificationTriggerEvent,
} from '@/types/api'

export interface NotificationLog {
  id: string
  taskId: string
  taskTitle: string
  triggerEvent: NotificationTriggerEvent
  channel: NotificationChannel
  deliveryStatus: NotificationDeliveryStatus
  sentAt: string
}

export const TRIGGER_EVENT_LABELS: Record<NotificationTriggerEvent, string> = {
  Created: 'Task created',
  Updated: 'Task updated',
  Deleted: 'Task deleted',
  Completed: 'Task completed',
  AfterCreationOffset: 'Follow-up reminder',
  BeforeLenientDeadline: 'Lenient deadline approaching',
  BeforeStrictDeadline: 'Strict deadline approaching',
  StrictDeadlinePassed: 'Strict deadline passed',
}

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

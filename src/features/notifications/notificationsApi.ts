import { api } from '@/lib/api'
import type { PagedResult } from '@/types/api'
import type { CreateNotificationRuleBody, NotificationRule, UpdateScheduleBody } from './types'

export interface NotificationRuleFilters {
  pageNumber: number
  pageSize: number
}

export async function fetchNotificationRulesForTask(
  taskId: string,
  filters: NotificationRuleFilters,
): Promise<PagedResult<NotificationRule>> {
  const { data } = await api.get<PagedResult<NotificationRule>>(
    `/tasks/${taskId}/notification-rules`,
    { params: filters },
  )
  return data
}

export async function createNotificationRule(
  taskId: string,
  body: CreateNotificationRuleBody,
): Promise<NotificationRule> {
  const { data } = await api.post<NotificationRule>(`/tasks/${taskId}/notification-rules`, body)
  return data
}

export async function updateNotificationRule(
  ruleId: string,
  body: UpdateScheduleBody,
): Promise<NotificationRule> {
  const { data } = await api.patch<NotificationRule>(`/notification-rules/${ruleId}`, body)
  return data
}

export async function deleteNotificationRule(ruleId: string): Promise<void> {
  await api.delete(`/notification-rules/${ruleId}`)
}

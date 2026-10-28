import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '@/lib/apiError'
import { toast } from '@/lib/toastStore'
import {
  createNotificationRule,
  deleteNotificationRule,
  fetchNotificationRulesForTask,
  updateNotificationRule,
  type NotificationRuleFilters,
} from '../notificationsApi'
import type { CreateNotificationRuleBody, UpdateScheduleBody } from '../types'

export const notificationRuleKeys = {
  all: ['notification-rules'] as const,
  forTask: (taskId: string) => ['notification-rules', 'task', taskId] as const,
  list: (taskId: string, filters: NotificationRuleFilters) =>
    ['notification-rules', 'task', taskId, filters] as const,
}

function useRefreshRules(taskId: string) {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: notificationRuleKeys.forTask(taskId) })
}

export function useNotificationRulesForTask(taskId: string, filters: NotificationRuleFilters) {
  return useQuery({
    queryKey: notificationRuleKeys.list(taskId, filters),
    queryFn: () => fetchNotificationRulesForTask(taskId, filters),
    placeholderData: keepPreviousData,
  })
}

export function useCreateNotificationRule(taskId: string) {
  const refresh = useRefreshRules(taskId)
  return useMutation({
    mutationFn: (body: CreateNotificationRuleBody) => createNotificationRule(taskId, body),
    onSuccess: () => toast.success('Reminder rule created'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

export function useUpdateNotificationRule(taskId: string) {
  const refresh = useRefreshRules(taskId)
  return useMutation({
    mutationFn: ({ ruleId, body }: { ruleId: string; body: UpdateScheduleBody }) =>
      updateNotificationRule(ruleId, body),
    onSuccess: () => toast.success('Reminder rule updated'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

export function useDeleteNotificationRule(taskId: string) {
  const refresh = useRefreshRules(taskId)
  return useMutation({
    mutationFn: (ruleId: string) => deleteNotificationRule(ruleId),
    onSuccess: () => toast.success('Reminder rule deleted'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

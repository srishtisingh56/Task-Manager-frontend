import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchNotificationLogs, type NotificationLogFilters } from '../notificationsApi'

export const BELL_PAGE_SIZE = 10

export const notificationLogKeys = {
  all: ['notification-logs'] as const,
  list: (filters: NotificationLogFilters) => ['notification-logs', 'list', filters] as const,
}

export function useNotificationLogs(filters: NotificationLogFilters) {
  return useQuery({
    queryKey: notificationLogKeys.list(filters),
    queryFn: () => fetchNotificationLogs(filters),
    placeholderData: keepPreviousData,
  })
}

export function useBellNotifications() {
  const filters: NotificationLogFilters = {
    channel: 'App',
    onlyMine: true,
    pageNumber: 1,
    pageSize: BELL_PAGE_SIZE,
  }
  return useQuery({
    queryKey: notificationLogKeys.list(filters),
    queryFn: () => fetchNotificationLogs(filters),
    refetchInterval: 30_000, // polling until SignalR push exists
  })
}

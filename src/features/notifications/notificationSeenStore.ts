import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { parseUtc } from '@/lib/dates'

// Logs have no read flag, so "unread" = newer than the last seen sentAt, tracked per user on this device.
interface NotificationSeenState {
  lastSeenAtByUser: Record<string, string>
  markSeen: (userId: string, sentAt: string) => void
}

export const useNotificationSeenStore = create<NotificationSeenState>()(
  persist(
    (set) => ({
      lastSeenAtByUser: {},
      markSeen: (userId, sentAt) =>
        set((s) => {
          const prev = s.lastSeenAtByUser[userId]
          if (prev && parseUtc(prev).getTime() >= parseUtc(sentAt).getTime()) return s
          return { lastSeenAtByUser: { ...s.lastSeenAtByUser, [userId]: sentAt } }
        }),
    }),
    { name: 'taskmanager-notifications-seen' },
  ),
)

export function isNewerThan(sentAt: string, lastSeenAt: string | undefined): boolean {
  return !lastSeenAt || parseUtc(sentAt).getTime() > parseUtc(lastSeenAt).getTime()
}

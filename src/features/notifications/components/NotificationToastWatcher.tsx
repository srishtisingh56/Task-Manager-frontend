import { useEffect, useRef } from 'react'
import { parseUtc } from '@/lib/dates'
import { toast } from '@/lib/toastStore'
import { useBellNotifications } from '../hooks/useNotificationLogs'
import { TRIGGER_EVENT_LABELS } from '../types'

/** Mount once near the app root. Renders nothing; just pops a toast for logs newer than the last poll. */
export function NotificationToastWatcher() {
  const { data } = useBellNotifications()
  const lastSeenAtRef = useRef<string | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    const items = data?.items
    if (!items) return

    if (!initializedRef.current) {
      // First load: just set the baseline, don't toast for logs that already existed.
      initializedRef.current = true
      lastSeenAtRef.current = items[0]?.sentAt ?? null
      return
    }

    const baseline = lastSeenAtRef.current
    const newItems = items.filter(
      (log) => !baseline || parseUtc(log.sentAt).getTime() > parseUtc(baseline).getTime(),
    )
    if (newItems.length === 0) return

    for (const log of [...newItems].reverse()) {
      toast.notify(`${TRIGGER_EVENT_LABELS[log.triggerEvent]}: ${log.taskTitle}`)
    }
    lastSeenAtRef.current = items[0].sentAt
  }, [data])

  return null
}

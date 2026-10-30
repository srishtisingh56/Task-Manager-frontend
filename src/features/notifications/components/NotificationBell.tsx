import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { formatDateTime, formatRelative } from '@/lib/dates'
import { BELL_PAGE_SIZE, useBellNotifications } from '../hooks/useNotificationLogs'
import { isNewerThan, useNotificationSeenStore } from '../notificationSeenStore'
import { TRIGGER_EVENT_LABELS } from '../types'

export function NotificationBell() {
  const userId = useAuthStore((s) => s.user!.id)
  const lastSeenAt = useNotificationSeenStore((s) => s.lastSeenAtByUser[userId])
  const markSeen = useNotificationSeenStore((s) => s.markSeen)
  const [open, setOpen] = useState(false)
  // Snapshot taken on open so new items stay highlighted while the dropdown is showing.
  const [highlightAfter, setHighlightAfter] = useState<string | undefined>()
  const ref = useRef<HTMLDivElement>(null)

  const { data, isPending, isError } = useBellNotifications()
  const items = data?.items ?? []
  const newest = items[0]?.sentAt
  const unread = items.filter((l) => isNewerThan(l.sentAt, lastSeenAt)).length

  // Uses the server's sentAt rather than Date.now() to avoid client/server clock skew.
  useEffect(() => {
    if (open && newest) markSeen(userId, newest)
  }, [open, newest, userId, markSeen])

  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const toggle = () => {
    if (!open) setHighlightAfter(lastSeenAt)
    setOpen((o) => !o)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        className="relative rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-4.5 rounded-full bg-red-500 px-1 text-center text-[10px] font-semibold leading-4.5 text-white">
            {unread >= BELL_PAGE_SIZE ? `${BELL_PAGE_SIZE - 1}+` : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
          <div className="border-b border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200">Notifications</div>

          {isPending ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">Loading…</p>
          ) : isError ? (
            <p className="px-4 py-6 text-center text-sm text-red-300">Couldn't load notifications.</p>
          ) : items.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">You're all caught up.</p>
          ) : (
            <ul className="max-h-96 divide-y divide-slate-800 overflow-y-auto">
              {items.map((log) => (
                <li key={log.id}>
                  <Link
                    to={`/notifications?taskId=${log.taskId}`}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 hover:bg-slate-800 ${
                      isNewerThan(log.sentAt, highlightAfter) ? 'bg-indigo-500/10' : ''
                    }`}
                  >
                    <p className="text-sm text-slate-100">{TRIGGER_EVENT_LABELS[log.triggerEvent]}</p>
                    <p className="truncate text-sm text-slate-400">{log.taskTitle}</p>
                    <time dateTime={log.sentAt} title={formatDateTime(log.sentAt)} className="mt-0.5 block text-xs text-slate-500">
                      {formatRelative(log.sentAt)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-slate-800 px-4 py-2.5 text-center text-sm text-indigo-400 hover:bg-slate-800"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  )
}

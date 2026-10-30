import { useSearchParams } from 'react-router-dom'
import { Pagination } from '@/components/Pagination'
import { getErrorMessage } from '@/lib/apiError'
import { formatDateTime } from '@/lib/dates'
import type { NotificationDeliveryStatus } from '@/types/api'
import { useNotificationLogs } from '../hooks/useNotificationLogs'
import { TRIGGER_EVENT_LABELS } from '../types'

const PAGE_SIZE = 20

const STATUS_CLASSES: Record<NotificationDeliveryStatus, string> = {
  Sent: 'bg-emerald-500/15 text-emerald-300',
  Failed: 'bg-red-500/15 text-red-300',
  Pending: 'bg-amber-500/15 text-amber-300',
}

const CHANNEL_LABELS = { App: 'In-app', Email: 'Email', Sms: 'SMS' } as const

export function NotificationLogsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const taskId = searchParams.get('taskId') ?? undefined
  const pageNumber = Math.max(1, Number(searchParams.get('page')) || 1)

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useNotificationLogs({
    taskId,
    pageNumber,
    pageSize: PAGE_SIZE,
  })

  function updateParams(changes: Record<string, string | undefined>) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      for (const [key, val] of Object.entries(changes)) {
        if (val === undefined) params.delete(key)
        else params.set(key, val)
      }
      return params
    })
  }

  const filterByTask = (id: string | undefined) => updateParams({ taskId: id, page: undefined })
  const changePage = (p: number) => updateParams({ page: String(p) })

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1
  const filteredTaskTitle = taskId ? data?.items[0]?.taskTitle : undefined

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Notifications</h1>
        {data && (
          <p className="text-sm text-slate-400">
            {data.totalCount} {data.totalCount === 1 ? 'entry' : 'entries'}
          </p>
        )}
      </div>

      {taskId && (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-600 px-3.5 py-1.5 text-sm text-white">
            Task: {filteredTaskTitle ?? 'selected task'}
          </span>
          <button
            type="button"
            onClick={() => filterByTask(undefined)}
            className="text-sm text-indigo-400 hover:text-indigo-500"
          >
            Clear filter
          </button>
        </div>
      )}

      {isPending ? (
        <p className="text-slate-400">Loading notifications…</p>
      ) : isError ? (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
          <p className="text-red-300">{getErrorMessage(error)}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg border border-red-400/40 px-3 py-1.5 text-sm text-red-200 hover:bg-red-500/10"
          >
            Try again
          </button>
        </div>
      ) : data.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
          <p className="text-slate-300">No notifications yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            {taskId ? 'Nothing has been sent for this task.' : 'Sent notifications will appear here.'}
          </p>
        </div>
      ) : (
        <>
          <ul className={`space-y-3 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
            {data.items.map((log) => (
              <li key={log.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100">{TRIGGER_EVENT_LABELS[log.triggerEvent]}</p>
                    {taskId ? (
                      <p className="truncate text-sm text-slate-400">{log.taskTitle}</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => filterByTask(log.taskId)}
                        title="Show only this task"
                        className="max-w-full truncate text-left text-sm text-slate-400 hover:text-indigo-400 hover:underline"
                      >
                        {log.taskTitle}
                      </button>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2 text-xs">
                    <span className="rounded-full bg-slate-700/50 px-2.5 py-0.5 font-medium text-slate-300">
                      {CHANNEL_LABELS[log.channel]}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 font-medium ${STATUS_CLASSES[log.deliveryStatus]}`}>
                      {log.deliveryStatus}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">{formatDateTime(log.sentAt)}</p>
              </li>
            ))}
          </ul>
          <Pagination page={pageNumber} totalPages={totalPages} onChange={changePage} disabled={isPlaceholderData} />
        </>
      )}
    </div>
  )
}

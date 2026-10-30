import { useNavigate, useSearchParams } from 'react-router-dom'
import { Pagination } from '@/components/Pagination'
import { FilterTabs } from '@/components/FilterTabs'
import { Badge, type BadgeTone } from '@/components/Badge'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/States'
import { formatDateTime, formatRelative } from '@/lib/dates'
import type { NotificationChannel, NotificationDeliveryStatus } from '@/types/api'
import { useNotificationLogs } from '../hooks/useNotificationLogs'
import { TRIGGER_EVENT_LABELS } from '../types'

const PAGE_SIZE = 20

const STATUS_TONES: Record<NotificationDeliveryStatus, BadgeTone> = {
  Sent: 'green',
  Failed: 'red',
  Pending: 'amber',
}

const CHANNEL_LABELS = { App: 'In-app', Email: 'Email', Sms: 'SMS' } as const

const CHANNEL_OPTIONS: { label: string; value: NotificationChannel | undefined }[] = [
  { label: 'In-app', value: 'App' },
  { label: 'Email', value: 'Email' },
]

const MINE_OPTIONS: { label: string; value: 'true' | undefined }[] = [{ label: 'Sent to me', value: 'true' }]

export function NotificationLogsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const taskId = searchParams.get('taskId') ?? undefined
  const channel = CHANNEL_OPTIONS.find((o) => o.value === searchParams.get('channel'))?.value
  const onlyMine = searchParams.get('onlyMine') === 'true'
  const pageNumber = Math.max(1, Number(searchParams.get('page')) || 1)

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useNotificationLogs({
    taskId,
    channel,
    onlyMine: onlyMine || undefined,
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
  const changeChannel = (c: NotificationChannel | undefined) => updateParams({ channel: c, page: undefined })
  const changeOnlyMine = (v: 'true' | undefined) => updateParams({ onlyMine: v, page: undefined })
  const changePage = (p: number) => updateParams({ page: String(p) })
  const hasFilters = !!(taskId || channel || onlyMine)

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

      <div className="flex flex-wrap items-center gap-2">
        <FilterTabs label="Filter by channel" options={CHANNEL_OPTIONS} value={channel} onChange={changeChannel} />
        <span className="mx-1 h-5 w-px bg-slate-700" aria-hidden />
        <FilterTabs
          label="Filter by recipient"
          options={MINE_OPTIONS}
          value={onlyMine ? 'true' : undefined}
          onChange={changeOnlyMine}
        />
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2">
          {taskId && (
            <span className="rounded-full bg-indigo-600 px-3.5 py-1.5 text-sm text-white">
              Task: {filteredTaskTitle ?? 'selected task'}
            </span>
          )}
          <button
            type="button"
            onClick={() => updateParams({ taskId: undefined, channel: undefined, onlyMine: undefined, page: undefined })}
            className="text-sm text-indigo-400 hover:text-indigo-500"
          >
            Clear filters
          </button>
        </div>
      )}

      {isPending ? (
        <ListSkeleton label="Loading notifications" />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No notifications yet."
          hint={hasFilters ? 'Nothing matches these filters.' : 'Sent notifications will appear here.'}
        />
      ) : (
        <>
          <ul className={`space-y-3 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
            {data.items.map((log) => (
                <li
                  key={log.id}
                  onClick={() => navigate(`/tasks/${log.taskId}`)}
                  title="Open task"
                  className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-slate-600"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-100">{TRIGGER_EVENT_LABELS[log.triggerEvent]}</p>
                      {taskId ? (
                        <p className="truncate text-sm text-slate-400">{log.taskTitle}</p>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            filterByTask(log.taskId)
                          }}
                          title="Show only this task"
                          className="max-w-full truncate text-left text-sm text-slate-400 hover:text-indigo-400 hover:underline"
                        >
                          {log.taskTitle}
                        </button>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Badge>{CHANNEL_LABELS[log.channel]}</Badge>
                      <Badge tone={STATUS_TONES[log.deliveryStatus]}>{log.deliveryStatus}</Badge>
                    </div>
                  </div>
                  <time dateTime={log.sentAt} title={formatDateTime(log.sentAt)} className="mt-2 block text-xs text-slate-500">
                    {formatRelative(log.sentAt)}
                  </time>
                </li>
            ))}
          </ul>
          <Pagination page={pageNumber} totalPages={totalPages} onChange={changePage} disabled={isPlaceholderData} />
        </>
      )}
    </div>
  )
}

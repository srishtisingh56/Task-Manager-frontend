import { Link, useParams } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { NotificationRulesSection } from '@/features/notifications/components/NotificationRulesSection'
import { ErrorState, ListSkeleton } from '@/components/States'
import { formatDateTime } from '@/lib/dates'
import { TaskStatusBadge } from '../components/TaskStatusBadge'
import { useTask } from '../hooks/useTasks'
import { canEditTask } from '../permissions'

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const me = useAuthStore((s) => s.user!)
  const { data: task, isPending, isError, error, refetch } = useTask(id)

  if (isPending) return <ListSkeleton count={1} label="Loading task" />
  if (isError) {
    return (
      <div className="space-y-3">
        <ErrorState error={error} onRetry={() => refetch()} />
        <Link to="/" className="text-sm text-indigo-400 hover:underline">Back to tasks</Link>
      </div>
    )
  }

  const person = (userId: string, name: string | null) => (
    <Link to={`/users/${userId}`} className="text-slate-100 hover:underline">
      {userId === me.id ? 'You' : (name ?? 'Unknown user')}
    </Link>
  )

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-slate-400 hover:text-slate-200">← Back to tasks</Link>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-100">{task.title}</h1>
          <TaskStatusBadge status={task.status} />
        </div>

        {task.description && (
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{task.description}</p>
        )}

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">Created by</dt>
            <dd>{person(task.createdByUserId, task.createdByName)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">Assigned to</dt>
            <dd>{person(task.assignedToUserId, task.assignedToName)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">Priority</dt>
            <dd className="text-slate-100">{task.priority ?? 'None'}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">Lenient deadline</dt>
            <dd className="text-slate-100">{formatDateTime(task.lenientDeadline)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">Strict deadline</dt>
            <dd className="text-slate-100">{formatDateTime(task.strictDeadline)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">Repeats</dt>
            <dd className="text-slate-100">{task.isRepetitive ? 'Yes' : 'No'}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-800 pt-5">
          {canEditTask(task, me) && (
            <Link
              to={`/tasks/${task.id}/edit`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Edit task
            </Link>
          )}
          <Link
            to={`/notifications?taskId=${task.id}`}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            View notifications
          </Link>
        </div>
      </div>

      <NotificationRulesSection taskId={task.id} readOnly />
    </div>
  )
}

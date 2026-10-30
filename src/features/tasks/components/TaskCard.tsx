import type { TaskPriority } from '@/types/api'
import { formatDateTime } from '@/lib/dates'
import { TaskStatusBadge } from './TaskStatusBadge'
import type { Task } from '../types'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'


const priorityStyles: Record<TaskPriority, string> = {
  Low: 'text-slate-400',
  Medium: 'text-sky-300',
  High: 'text-orange-300',
  Critical: 'text-red-300',
}

function relationLabel(task: Task, me: string): string {
  const created = task.createdByUserId === me
  const assigned = task.assignedToUserId === me
  if (created && assigned) return 'Personal'
  if (created) return 'Assigned by you'
  if (assigned) return 'Assigned to you'
  return 'Other user' // only visible to system admins
}

function personLabel(id: string, name: string | null, me: string): string {
  if (id === me) return 'You'
  return name ?? 'Unknown user'
}

type Props = { task: Task; currentUserId: string; actions?: ReactNode }

export function TaskCard({ task, currentUserId, actions }: Props) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-medium text-slate-100">
          <Link to={`/tasks/${task.id}`} className="hover:underline">{task.title}</Link>
        </h2>
        <TaskStatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-400">{task.description}</p>
      )}

      <p className="mt-3 text-sm text-slate-400">
        <span title={task.createdByUserId}>{personLabel(task.createdByUserId, task.createdByName, currentUserId)}</span>
        <span className="mx-2 text-slate-600">→</span>
        <span title={task.assignedToUserId}>{personLabel(task.assignedToUserId, task.assignedToName, currentUserId)}</span>
      </p>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">Lenient deadline</dt>
          <dd className="text-slate-300">{formatDateTime(task.lenientDeadline)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Strict deadline</dt>
          <dd className="text-slate-300">{formatDateTime(task.strictDeadline)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <span className="rounded-md bg-slate-800 px-2 py-1 text-slate-300">
          {relationLabel(task, currentUserId)}
        </span>
        {task.priority && (
          <span className={priorityStyles[task.priority]}>{task.priority} priority</span>
        )}
        {task.isRepetitive && <span className="text-slate-500">Repeats</span>}
      </div>

      {actions}
    </article>
  )
}
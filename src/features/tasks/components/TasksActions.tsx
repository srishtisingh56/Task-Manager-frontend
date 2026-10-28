import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import type { User } from '@/features/auth/types'
import {
  canCompleteTask, canDeleteTask, canEditTask, canHaltTask, canReassignTask, canResumeTask,
} from '@/features/tasks/permissions'
import {
  useCompleteTask, useDeleteTask, useHaltTask, useResumeTask,
} from '@/features/tasks/hooks/useTaskActions'
import { getErrorMessage } from '@/lib/apiError'
import type { Task } from '@/features/tasks/types'
import { ReassignDialog } from './ReassignDialog'

const btn =
  'rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50'

type Props = { task: Task; me: User }

export function TaskActions({ task, me }: Props) {
  const complete = useCompleteTask()
  const halt = useHaltTask()
  const resume = useResumeTask()
  const del = useDeleteTask()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [reassignOpen, setReassignOpen] = useState(false)

  const can = {
    complete: canCompleteTask(task, me),
    edit: canEditTask(task, me),
    halt: canHaltTask(task, me),
    resume: canResumeTask(task, me),
    reassign: canReassignTask(task, me),
    delete: canDeleteTask(task, me),
  }
  if (!Object.values(can).some(Boolean)) return null

  const busy = complete.isPending || halt.isPending || resume.isPending

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
        {can.complete && (
          <button
            disabled={busy}
            onClick={() => complete.mutate(task.id)}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            Complete
          </button>
        )}
        {can.edit && (
          <Link to={`/tasks/${task.id}/edit`} className={btn}>Edit</Link>
        )}
        {can.halt && (
          <button disabled={busy} onClick={() => halt.mutate(task.id)} className={btn}>Halt</button>
        )}
        {can.resume && (
          <button disabled={busy} onClick={() => resume.mutate(task.id)} className={btn}>Resume</button>
        )}
        {can.reassign && (
          <button onClick={() => setReassignOpen(true)} className={btn}>Reassign</button>
        )}
        {(can.edit || can.delete) && (
          <div className="ml-auto flex items-center gap-2">
            {can.edit && (
              <Link to={`/tasks/${task.id}/edit?section=reminders`} className={btn}>Add reminder</Link>
            )}
            {can.delete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded-lg px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this task?"
          confirmLabel="Delete"
          destructive
          isPending={del.isPending}
          errorMessage={del.isError ? getErrorMessage(del.error) : undefined}
          onCancel={() => { del.reset(); setConfirmDelete(false) }}
          onConfirm={() => del.mutate(task.id, { onSuccess: () => setConfirmDelete(false) })}
        >
          <p>"{task.title}" will be removed and the assignee will be notified.</p>
          <p>You can undo from the message that appears right after.</p>
        </ConfirmDialog>
      )}

      {reassignOpen && <ReassignDialog task={task} onClose={() => setReassignOpen(false)} />}
    </>
  )
}
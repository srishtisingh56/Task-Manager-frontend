import { useState, type FormEvent } from 'react'
import { inputClass } from '@/components/Field'
import { useAuthStore } from '@/features/auth/authStore'
import { useReassignTask } from '@/features/tasks/hooks/useTaskActions'
import { getErrorMessage } from '@/lib/apiError'
import type { Task } from '@/features/tasks/types'

import { useWorkers } from '@/features/users/usersApi'
import { Modal } from '@/components/Model'
type Props = { task: Task; onClose: () => void }

export function ReassignDialog({ task, onClose }: Props) {
  const me = useAuthStore((s) => s.user!)
  const workers = useWorkers()
  const reassign = useReassignTask()
  const [target, setTarget] = useState('')

  const options = [
    { id: me.id, label: `Me (${me.name})` },
    ...(workers.data ?? []).map((w) => ({ id: w.id, label: w.name })),
  ].filter((o) => o.id !== task.assignedToUserId) // can't reassign to the current assignee

  function submit(e: FormEvent) {
    e.preventDefault()
    reassign.mutate({ id: task.id, newAssigneeId: target }, { onSuccess: onClose })
  }

  return (
    <Modal title="Reassign task" onClose={onClose} busy={reassign.isPending}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-slate-400">Choose who should take over "{task.title}".</p>

        {reassign.isError && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {getErrorMessage(reassign.error)}
          </p>
        )}

        <select
          aria-label="New assignee"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>Select a person…</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={reassign.isPending}
            className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!target || reassign.isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {reassign.isPending ? 'Reassigning…' : 'Reassign'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
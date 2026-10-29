import { useState } from 'react'
import { Modal } from '@/components/Model'
import { inputClass } from '@/components/Field'
import { getErrorMessage } from '@/lib/apiError'
import type { User } from '@/features/auth/types'
import { useAllUsers } from '../hooks/useUsers'
import { useAssignManager, useRemoveManager } from '../hooks/useUserActions'

const CANDIDATE_PAGE_SIZE = 100

export function AssignManagerDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const [managerId, setManagerId] = useState('')
  const candidates = useAllUsers({ pageNumber: 1, pageSize: CANDIDATE_PAGE_SIZE })
  const assign = useAssignManager()
  const remove = useRemoveManager()

  const options = (candidates.data?.items ?? []).filter((u) => u.id !== user.id && u.isActive)
  const busy = assign.isPending || remove.isPending
  const error = assign.error ?? remove.error

  return (
    <Modal title={`Manager for ${user.name}`} onClose={onClose} busy={busy}>
      <div className="space-y-4">
        {!!error && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {getErrorMessage(error)}
          </p>
        )}

        <select
          aria-label="New manager"
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a manager…</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          {user.managerId && (
            <button
              type="button"
              disabled={busy}
              onClick={() => remove.mutate(user.id, { onSuccess: onClose })}
              className="rounded-lg px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
            >
              Remove manager
            </button>
          )}
          <div className="ml-auto flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!managerId || busy}
              onClick={() => assign.mutate({ workerId: user.id, managerId }, { onSuccess: onClose })}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

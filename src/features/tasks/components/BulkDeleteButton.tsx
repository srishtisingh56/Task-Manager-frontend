import { useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useBulkDeleteTasks } from '@/features/tasks/hooks/useTaskActions'
import { getErrorMessage } from '@/lib/apiError'
import type { TaskStatus } from '@/types/api'

export function BulkDeleteButton({ status }: { status: TaskStatus }) {
  const [open, setOpen] = useState(false)
  const bulk = useBulkDeleteTasks()

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-red-300 hover:text-red-400">
        Delete all my {status} tasks
      </button>

      {open && (
        <ConfirmDialog
          title={`Delete all ${status} tasks?`}
          confirmLabel="Delete all"
          destructive
          isPending={bulk.isPending}
          errorMessage={bulk.isError ? getErrorMessage(bulk.error) : undefined}
          onCancel={() => { bulk.reset(); setOpen(false) }}
          onConfirm={() => bulk.mutate(status, { onSuccess: () => setOpen(false) })}
        >
          <p>
            This deletes <strong>every {status} task you created</strong>, not only the ones on this
            page, and it ignores the other filter. Tasks other people assigned to you are not affected.
          </p>
          <p>Assignees will be notified. There is no undo for bulk delete in the app.</p>
        </ConfirmDialog>
      )}
    </>
  )
}
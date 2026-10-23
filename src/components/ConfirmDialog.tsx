import type { ReactNode } from 'react'
import { Modal } from './Model'

type Props = {
  title: string
  children: ReactNode
  confirmLabel: string
  destructive?: boolean
  isPending: boolean
  errorMessage?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title, children, confirmLabel, destructive, isPending, errorMessage, onConfirm, onCancel,
}: Props) {
  return (
    <Modal title={title} onClose={onCancel} busy={isPending}>
      <div className="space-y-2 text-sm text-slate-300">{children}</div>

      {errorMessage && (
        <p role="alert" className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
            destructive ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {isPending ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
import type { ReactNode } from 'react'
import { Modal } from './Model'
import { Button } from './Button'

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
        <Button variant="ghost" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button variant={destructive ? 'destructive' : 'primary'} onClick={onConfirm} disabled={isPending}>
          {isPending ? 'Working…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
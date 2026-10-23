import { useEffect, useRef, type ReactNode } from 'react'

type Props = { title: string; onClose: () => void; busy?: boolean; children: ReactNode }

/** Mount it to show it, unmount it to hide it. */
export function Modal({ title, onClose, busy, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-title"
      onCancel={(e) => {
        e.preventDefault() // Esc key: let our state decide
        if (!busy) onClose()
      }}
      className="m-auto w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-100 backdrop:bg-black/60"
    >
      <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </dialog>
  )
}
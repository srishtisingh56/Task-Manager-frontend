import { useToastStore } from '@/lib/toastStore'

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === 'error' ? 'alert' : 'status'}
          className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm shadow-lg ${
            t.kind === 'error'
              ? 'border-red-500/30 bg-red-950 text-red-200'
              : 'border-slate-700 bg-slate-800 text-slate-100'
          }`}
        >
          <span>{t.message}</span>
          {t.action && (
            <button
              className="font-medium text-indigo-300 hover:underline"
              onClick={() => {
                t.action!.onClick()
                dismiss(t.id)
              }}
            >
              {t.action.label}
            </button>
          )}
          <button aria-label="Dismiss" onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-200">
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
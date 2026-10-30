import { useToastStore, type Toast } from '@/lib/toastStore'

const kindStyles: Record<Toast['kind'], string> = {
  success: 'border-slate-700 bg-slate-800 text-slate-100',
  error: 'border-red-500/30 bg-red-950 text-red-200',
  info: 'border-indigo-500/40 bg-indigo-950 text-indigo-100',
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === 'error' ? 'alert' : 'status'}
          className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm shadow-lg ${kindStyles[t.kind]}`}
        >
          {t.kind === 'info' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 shrink-0 text-indigo-300" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9" />
            </svg>
          )}
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
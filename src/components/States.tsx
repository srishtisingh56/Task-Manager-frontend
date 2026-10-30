import { getErrorMessage } from '@/lib/apiError'

export function ListSkeleton({ count = 3, label = 'Loading' }: { count?: number; label?: string }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-900" />
      ))}
    </div>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
      <p className="text-slate-300">{title}</p>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  )
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
      <p className="text-red-300">{getErrorMessage(error)}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg border border-red-400/40 px-3 py-1.5 text-sm text-red-200 hover:bg-red-500/10"
        >
          Try again
        </button>
      )}
    </div>
  )
}

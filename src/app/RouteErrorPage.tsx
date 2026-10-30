import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'

export function RouteErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />

  if (import.meta.env.DEV) console.error(error)

  return (
    <div role="alert" className="mx-auto max-w-md p-8 text-center">
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8">
        <p className="text-lg font-semibold text-red-200">Something went wrong</p>
        <p className="mt-2 text-sm text-red-300/80">An unexpected error occurred while showing this page.</p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg border border-red-400/40 px-3 py-1.5 text-sm text-red-200 hover:bg-red-500/10"
          >
            Reload
          </button>
          <Link to="/" className="rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}

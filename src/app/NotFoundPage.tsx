import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
      <p className="text-4xl font-semibold text-slate-200">404</p>
      <p className="mt-2 text-slate-300">This page doesn't exist.</p>
      <Link to="/" className="mt-4 inline-block text-sm text-indigo-400 hover:underline">
        Back to tasks
      </Link>
    </div>
  )
}

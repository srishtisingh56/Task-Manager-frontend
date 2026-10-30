import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/States'
import { useWorkers } from '../usersApi'

export function MyTeamPage() {
  const { data, isPending, isError, error, refetch } = useWorkers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">My team</h1>
        {data && (
          <p className="text-sm text-slate-400">
            {data.length} direct {data.length === 1 ? 'report' : 'reports'}
          </p>
        )}
      </div>

      {isPending ? (
        <ListSkeleton label="Loading team" />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : data.length === 0 ? (
        <EmptyState title="No one reports to you yet." hint="Workers assigned to you by an admin will appear here." />
      ) : (
        <ul className="space-y-3">
          {data.map((worker) => (
            <li key={worker.id}>
              <Link
                to={`/users/${worker.id}`}
                className="block rounded-xl border border-slate-800 bg-slate-900 p-5 font-medium text-slate-100 hover:border-slate-600"
              >
                {worker.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

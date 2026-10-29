import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { Pagination } from '@/components/Pagination'
import { FilterTabs } from '@/components/FilterTabs'
import { getErrorMessage } from '@/lib/apiError'
import type { User } from '@/features/auth/types'
import { useAllUsers } from '../hooks/useUsers'
import { STATUS_OPTIONS } from '../filterOptions'
import {
  useDeactivateUser, useDemoteFromSystemAdmin, usePromoteToSystemAdmin, useReactivateUser,
} from '../hooks/useUserActions'
import { AssignManagerDialog } from '../components/AssignManagerDialog'

const PAGE_SIZE = 10

export function UsersPage() {
  const me = useAuthStore((s) => s.user!)
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<'active' | 'inactive' | undefined>(undefined)
  const [managing, setManaging] = useState<User | null>(null)

  const changeStatus = (value: 'active' | 'inactive' | undefined) => {
    setStatus(value)
    setPage(1)
  }

  const { data, isPending, isError, error, isPlaceholderData } = useAllUsers({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    isActive: status === 'active' ? true : status === 'inactive' ? false : undefined,
  })
  const promote = usePromoteToSystemAdmin()
  const demote = useDemoteFromSystemAdmin()
  const deactivate = useDeactivateUser()
  const reactivate = useReactivateUser()

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Users</h1>
          {data && <p className="text-sm text-slate-400">{data.totalCount} users</p>}
        </div>
        <Link
          to="/admin/users/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          New user
        </Link>
      </div>

      <FilterTabs label="Filter by status" options={STATUS_OPTIONS} value={status} onChange={changeStatus} />

      {isPending ? (
        <p className="text-slate-400">Loading users…</p>
      ) : isError ? (
        <p role="alert" className="text-red-300">{getErrorMessage(error)}</p>
      ) : (
        <>
          <div className={`space-y-3 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
            {data.items.map((user) => (
              <article
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-600"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium text-slate-100">
                      <Link
                        to={`/users/${user.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                      >
                        {user.name}
                      </Link>{' '}
                      {user.id === me.id && <span className="text-slate-500">(you)</span>}
                    </h2>
                    <p className="text-sm text-slate-400">{user.email} · {user.phoneNumber}</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-medium ${
                        user.isActive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-500/15 text-slate-300'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {user.isSystemAdmin && (
                      <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 font-medium text-indigo-300">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {user.managerId ? 'Reports to a manager' : 'No manager assigned'}
                </p>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4"
                >
                  <button
                    type="button"
                    onClick={() => setManaging(user)}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Manage manager
                  </button>

                  {user.id !== me.id && (
                    <>
                      {user.isSystemAdmin ? (
                        <button
                          disabled={demote.isPending}
                          onClick={() => demote.mutate(user.id)}
                          className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                        >
                          Demote from admin
                        </button>
                      ) : (
                        <button
                          disabled={promote.isPending}
                          onClick={() => promote.mutate(user.id)}
                          className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                        >
                          Promote to admin
                        </button>
                      )}

                      {user.isActive ? (
                        <button
                          disabled={deactivate.isPending}
                          onClick={() => deactivate.mutate(user.id)}
                          className="ml-auto rounded-lg px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          disabled={reactivate.isPending}
                          onClick={() => reactivate.mutate(user.id)}
                          className="ml-auto rounded-lg px-3 py-1.5 text-sm text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
                        >
                          Reactivate
                        </button>
                      )}
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} disabled={isPlaceholderData} />
        </>
      )}

      {managing && <AssignManagerDialog user={managing} onClose={() => setManaging(null)} />}
    </div>
  )
}

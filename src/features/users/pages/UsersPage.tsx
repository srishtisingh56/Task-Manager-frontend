import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { Pagination } from '@/components/Pagination'
import { FilterTabs } from '@/components/FilterTabs'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { buttonClass } from '@/components/buttonClass'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/States'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const status = STATUS_OPTIONS.find((opt) => opt.value === searchParams.get('status'))?.value
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const [managing, setManaging] = useState<User | null>(null)
  const [confirming, setConfirming] = useState<{ action: 'deactivate' | 'demote'; user: User } | null>(null)

  function updateParams(changes: Record<string, string | undefined>) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      for (const [key, val] of Object.entries(changes)) {
        if (val === undefined) params.delete(key)
        else params.set(key, val)
      }
      return params
    })
  }

  const changeStatus = (value: 'active' | 'inactive' | undefined) => updateParams({ status: value, page: undefined })
  const setPage = (p: number) => updateParams({ page: String(p) })

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useAllUsers({
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
        <Link to="/admin/users/new" className={buttonClass('primary')}>
          New user
        </Link>
      </div>

      <FilterTabs label="Filter by status" options={STATUS_OPTIONS} value={status} onChange={changeStatus} />

      {isPending ? (
        <ListSkeleton label="Loading users" />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No users found." hint={status ? 'No users match this filter.' : undefined} />
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
                  <div className="flex gap-2">
                    <Badge tone={user.isActive ? 'green' : 'slate'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                    {user.isSystemAdmin && <Badge tone="indigo">Admin</Badge>}
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {user.managerId ? 'Reports to a manager' : 'No manager assigned'}
                </p>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4"
                >
                  <Button size="sm" onClick={() => setManaging(user)}>
                    Manage manager
                  </Button>

                  {user.id !== me.id && (
                    <>
                      {user.isSystemAdmin ? (
                        <Button size="sm" onClick={() => setConfirming({ action: 'demote', user })}>
                          Demote from admin
                        </Button>
                      ) : (
                        <Button size="sm" disabled={promote.isPending} onClick={() => promote.mutate(user.id)}>
                          Promote to admin
                        </Button>
                      )}

                      {user.isActive ? (
                        <Button
                          size="sm"
                          variant="danger"
                          className="ml-auto"
                          onClick={() => setConfirming({ action: 'deactivate', user })}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="success"
                          className="ml-auto"
                          disabled={reactivate.isPending}
                          onClick={() => reactivate.mutate(user.id)}
                        >
                          Reactivate
                        </Button>
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

      {confirming && (
        <ConfirmDialog
          title={confirming.action === 'deactivate' ? `Deactivate ${confirming.user.name}?` : `Demote ${confirming.user.name}?`}
          confirmLabel={confirming.action === 'deactivate' ? 'Deactivate' : 'Demote'}
          destructive
          isPending={confirming.action === 'deactivate' ? deactivate.isPending : demote.isPending}
          onCancel={() => setConfirming(null)}
          onConfirm={() => {
            const mutation = confirming.action === 'deactivate' ? deactivate : demote
            mutation.mutate(confirming.user.id, { onSuccess: () => setConfirming(null) })
          }}
        >
          <p>
            {confirming.action === 'deactivate'
              ? 'Their account will be marked inactive and they will stop receiving notifications. You can reactivate them later.'
              : 'They will lose system admin rights immediately. You can promote them again later.'}
          </p>
        </ConfirmDialog>
      )}
    </div>
  )
}

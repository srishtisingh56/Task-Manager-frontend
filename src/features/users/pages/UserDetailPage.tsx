import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { Field, inputClass } from '@/components/Field'
import { ErrorState, ListSkeleton } from '@/components/States'
import { Badge } from '@/components/Badge'
import { getErrorMessage, getFieldErrors } from '@/lib/apiError'
import { useUser } from '../hooks/useUsers'
import { useUpdateContactDetails } from '../hooks/useUserActions'
import { canEditUser } from '../permissions'
import { FIELD_NAMES, contactDetailsSchema, type ContactDetailsFormValues } from '../form/contactDetailsSchema'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const me = useAuthStore((s) => s.user!)
  const [editing, setEditing] = useState(false)
  const { data: user, isPending, isError, error, refetch } = useUser(id)
  const update = useUpdateContactDetails()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<ContactDetailsFormValues>({ resolver: zodResolver(contactDetailsSchema) })

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email, phoneNumber: user.phoneNumber })
  }, [user, reset])

  useEffect(() => {
    if (!update.error) return
    for (const [name, message] of Object.entries(getFieldErrors(update.error))) {
      if ((FIELD_NAMES as readonly string[]).includes(name)) {
        setError(name as keyof ContactDetailsFormValues, { type: 'server', message })
      }
    }
  }, [update.error, setError])

  if (!id) return <Navigate to="/" replace />
  if (isPending) return <ListSkeleton count={1} label="Loading user" />
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />

  const canEdit = canEditUser(me, user)

  const onSubmit = (values: ContactDetailsFormValues) => {
    const body: { name?: string; email?: string; phoneNumber?: string } = {}
    if (dirtyFields.name) body.name = values.   name.trim()
    if (dirtyFields.email) body.email = values.email.trim()
    if (dirtyFields.phoneNumber) body.phoneNumber = values.phoneNumber.trim()
    if (Object.keys(body).length === 0) {
      setEditing(false)
      return
    }
    update.mutate({ userId: user.id, body }, { onSuccess: () => setEditing(false) })
  }

  return (
    <div className="space-y-6">
      <Link to={me.isSystemAdmin ? '/admin/users' : '/'} className="text-normal text-slate-400 hover:text-slate-200">
        ← {me.isSystemAdmin ? 'Back to users' : 'Back to tasks'}
      </Link>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 m-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-100">{user.name}</h1>
          <Badge tone={user.isActive ? 'green' : 'slate'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">Name</dt>
            <dd className="text-slate-100">{user.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">Email</dt>
            <dd className="text-slate-100">{user.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">Phone Number</dt>
            <dd className="text-slate-100">{user.phoneNumber}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">Manager</dt>
            <dd className="text-slate-100">{user.managerName ?? 'None'}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-36 shrink-0 text-slate-500">System Admin</dt>
            <dd className="text-slate-100">{user.isSystemAdmin ? 'True' : 'False'}</dd>
          </div>
        </dl>

        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Edit contact details
          </button>
        )}

        {canEdit && editing && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4 border-t border-slate-800 pt-5">
            {update.isError && (
              <div role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {getErrorMessage(update.error)}
              </div>
            )}

            <Field label="Name" htmlFor="name" error={errors.name?.message}>
              <input id="name" {...register('name')} className={inputClass} />
            </Field>

            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <input id="email" type="email" {...register('email')} className={inputClass} />
            </Field>

            <Field
              label="Phone number"
              htmlFor="phoneNumber"
              error={errors.phoneNumber?.message}
              hint="10 digits, no country code."
            >
              <input id="phoneNumber" {...register('phoneNumber')} className={inputClass} />
            </Field>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  reset({ name: user.name, email: user.email, phoneNumber: user.phoneNumber })
                  setEditing(false)
                }}
                disabled={update.isPending}
                className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={update.isPending}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {update.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

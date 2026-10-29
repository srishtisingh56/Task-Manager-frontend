import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Field, inputClass } from '@/components/Field'
import { getErrorMessage, getFieldErrors } from '@/lib/apiError'
import { useCreateUser } from '../hooks/useUserActions'
import { FIELD_NAMES, createUserSchema, type CreateUserFormValues } from '../form/createUserSchema'

export function CreateUserPage() {
  const navigate = useNavigate()
  const create = useCreateUser()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateUserFormValues>({ resolver: zodResolver(createUserSchema) })

  useEffect(() => {
    if (!create.error) return
    for (const [name, message] of Object.entries(getFieldErrors(create.error))) {
      if ((FIELD_NAMES as readonly string[]).includes(name)) {
        setError(name as keyof CreateUserFormValues, { type: 'server', message })
      }
    }
  }, [create.error, setError])

  const onSubmit = (values: CreateUserFormValues) =>
    create.mutate(values, { onSuccess: () => navigate('/admin/users') })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-100">New user</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6"
      >
        {create.isError && (
          <div role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {getErrorMessage(create.error)}
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

        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <input id="password" type="password" {...register('password')} className={inputClass} />
        </Field>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/admin/users" className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {create.isPending ? 'Creating…' : 'Create user'}
          </button>
        </div>
      </form>
    </div>
  )
}

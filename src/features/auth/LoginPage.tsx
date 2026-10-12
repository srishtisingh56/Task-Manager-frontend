import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useLogin } from './useLogin'
import { isSessionValid, useAuthStore } from './authStore'
import { getErrorMessage } from '@/lib/apiError'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const loggedIn = useAuthStore((s) => isSessionValid(s))
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  if (loggedIn) return <Navigate to={from} replace />

  const onSubmit = (values: FormValues) =>
    login.mutate(values, { onSuccess: () => navigate(from, { replace: true }) })

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage your tasks.</p>
        </div>

        {login.isError && (
          <div role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {getErrorMessage(login.error)}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm text-slate-300">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm text-slate-300">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
          />
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
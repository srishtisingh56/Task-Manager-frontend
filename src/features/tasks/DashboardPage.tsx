import { useAuthStore } from '@/features/auth/authStore'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Hello, {user?.name}</h1>
        <button
          onClick={logout}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
        >
          Log out
        </button>
      </div>
      <p className="mt-2 text-slate-400">
        {user?.email} · {user?.isSystemAdmin ? 'System admin' : 'Member'}
      </p>
    </div>
  )
}
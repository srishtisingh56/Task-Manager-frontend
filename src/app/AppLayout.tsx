import { Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="font-semibold">TaskManager</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-400">{user?.name}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-700 px-3 py-1.5 hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
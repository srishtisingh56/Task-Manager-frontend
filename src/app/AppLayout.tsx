import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { Toaster } from '@/components/Toaster'
import { Button } from '@/components/Button'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { NotificationToastWatcher } from '@/features/notifications/components/NotificationToastWatcher'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-2.5 py-1.5 text-sm transition ${
    isActive ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
  }`

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
          <Link to="/" className="font-semibold">TaskManager</Link>

          {/* order-last + w-full on mobile pushes nav onto its own row */}
          <nav className="order-last flex w-full gap-1 overflow-x-auto sm:order-0 sm:w-auto sm:flex-1">
            <NavLink to="/" end className={navClass}>Tasks</NavLink>
            <NavLink to="/team" className={navClass}>My team</NavLink>
            <NavLink to="/notifications" className={navClass}>Notifications</NavLink>
            {user?.isSystemAdmin && <NavLink to="/admin/users" className={navClass}>Users</NavLink>}
          </nav>

          <div className="flex items-center gap-3 text-sm">
            <NotificationBell />
            {user && (
              <NavLink
                to={`/users/${user.id}`}
                title="My profile"
                className={({ isActive }) =>
                  `max-w-32 truncate ${isActive ? 'text-slate-100' : 'text-slate-400 hover:text-slate-200'}`
                }
              >
                {user.name}
              </NavLink>
            )}
            <Button size="sm" onClick={logout}>Log out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* decides which child page to render inside that area, based on the current route. */}
        <Outlet />
      </main>
      <Toaster />
      <NotificationToastWatcher />
    </div>
  )
}
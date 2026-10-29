import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './authStore'

export function AdminRoute() {
  const isAdmin = useAuthStore((s) => s.user?.isSystemAdmin ?? false)
  if (!isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}

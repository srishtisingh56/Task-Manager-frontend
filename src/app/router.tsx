import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/features/auth/LoginPage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { TasksPage } from '@/features/tasks/pages/TasksPage'
import { AppLayout } from './AppLayout'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: '/', element: <TasksPage /> }],
      },
    ],
  },
])
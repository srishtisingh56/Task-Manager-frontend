import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/features/auth/LoginPage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { AdminRoute } from '@/features/auth/AdminRoute'
import { TasksPage } from '@/features/tasks/pages/TasksPage'
import { AppLayout } from './AppLayout'
import { EditTaskPage } from '@/features/tasks/pages/EditTaskPage'
import { CreateTaskPage } from '@/features/tasks/pages/CreateTaskPage'
import { UsersPage } from '@/features/users/pages/UsersPage'
import { CreateUserPage } from '@/features/users/pages/CreateUserPage'
import { UserDetailPage } from '@/features/users/pages/UserDetailPage'
import { NotificationLogsPage } from '@/features/notifications/pages/NotificationLogsPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
        { path: '/', element: <TasksPage /> },
        { path: '/tasks/new', element: <CreateTaskPage /> },
        { path: '/tasks/:id/edit', element: <EditTaskPage /> },
        { path: '/users/:id', element: <UserDetailPage /> },
        { path: '/notifications', element: <NotificationLogsPage /> },
        {
          element: <AdminRoute />,
          children: [
            { path: '/admin/users', element: <UsersPage /> },
            { path: '/admin/users/new', element: <CreateUserPage /> },
          ],
        },
        ],
      },
    ],
  },
])
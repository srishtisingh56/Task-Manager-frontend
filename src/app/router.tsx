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
import { TaskDetailPage } from '@/features/tasks/pages/TaskDetailPage'
import { MyTeamPage } from '@/features/users/pages/MyTeamPage'
import { NotFoundPage } from './NotFoundPage'
import { RouteErrorPage } from './RouteErrorPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage />, errorElement: <RouteErrorPage /> },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            // Pathless so page errors render inside the layout, keeping the header.
            errorElement: <RouteErrorPage />,
            children: [
              { path: '/', element: <TasksPage /> },
              { path: '/tasks/new', element: <CreateTaskPage /> },
              { path: '/tasks/:id', element: <TaskDetailPage /> },
              { path: '/tasks/:id/edit', element: <EditTaskPage /> },
              { path: '/users/:id', element: <UserDetailPage /> },
              { path: '/team', element: <MyTeamPage /> },
              { path: '/notifications', element: <NotificationLogsPage /> },
              {
                element: <AdminRoute />,
                children: [
                  { path: '/admin/users', element: <UsersPage /> },
                  { path: '/admin/users/new', element: <CreateUserPage /> },
                ],
              },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
])
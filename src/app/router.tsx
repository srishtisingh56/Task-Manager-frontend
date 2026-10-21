import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '@/features/auth/LoginPage'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { TasksPage } from '@/features/tasks/pages/TasksPage'
import { AppLayout } from './AppLayout'
import { EditTaskPage } from '@/features/tasks/pages/EditTaskPage'
import { CreateTaskPage } from '@/features/tasks/pages/CreateTaskPage'

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
        ],
      },
    ],
  },
])
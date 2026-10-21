import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { useWorkers } from '@/features/users/usersApi'
import { TaskForm } from './TaskForm'
import { emptyTaskForm, toCreateBody } from '../form/taskFormMapping'
import { useCreateTask } from '../hooks/useCreateTask.ts'

export function CreateTaskPage() {
  const navigate = useNavigate()
  const me = useAuthStore((s) => s.user!)
  const workers = useWorkers()
  const create = useCreateTask()
    
  const defaultValues = useMemo(() => emptyTaskForm(me.id), [me.id])
  const assigneeOptions = useMemo(
    () => [
      { id: me.id, label: `Me (${me.name})` },
      ...(workers.data ?? []).map((w) => ({ id: w.id, label: w.name })),
    ],
    [me.id, me.name, workers.data],
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-100">New task</h1>
      <TaskForm
        mode="create"
        defaultValues={defaultValues}
        assigneeOptions={assigneeOptions}
        submitLabel="Create task"
        isSubmitting={create.isPending}
        error={create.error}
        onSubmit={(values) =>
          create.mutate(toCreateBody(values), { onSuccess: () => navigate('/') })
        }
      />
    </div>
  )
}


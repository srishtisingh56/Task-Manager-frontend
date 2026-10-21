import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { getErrorMessage } from '@/lib/apiError'
import { TaskForm } from './TaskForm'
import { useTask } from '../hooks/useTasks'
import { useUpdateTask, UpdateTaskError } from '../hooks/useUpdateTask'
import { canEditTask } from '../permissions'
import { buildTaskUpdates, taskToFormValues } from '../form/taskFormMapping'


export function EditTaskPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const me = useAuthStore((s) => s.user!)
  const { data: task, isPending, isError, error } = useTask(id)
  const update = useUpdateTask()

  if (isPending) return <p className="text-slate-400">Loading task…</p>
  if (isError) return <p role="alert" className="text-red-300">{getErrorMessage(error)}</p>

  if (!canEditTask(task, me)) {
    return (
      <div className="space-y-3">
        <p className="text-slate-300">
          This task can't be edited. Only the creator can edit it, and only while it is Pending or Halted.
        </p>
        <Link to="/" className="text-indigo-400 hover:underline">Back to tasks</Link>
      </div>
    )
  }

  const failed = update.error instanceof UpdateTaskError ? update.error : null
  const shownError = failed ? failed.original : update.error
  const prefix = failed && failed.saved.length > 0 ? `Already saved: ${failed.saved.join(', ')}. ` : ''

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-100">Edit task</h1>
      <TaskForm
        key={task.id}
        mode="edit"
        defaultValues={taskToFormValues(task)}
        assigneeOptions={[
          {
            id: task.assignedToUserId,
            label: task.assignedToUserId === me.id ? 'Me' : (task.assignedToName ?? 'Current assignee'),
          },
        ]}
        submitLabel="Save changes"
        isSubmitting={update.isPending}
        error={shownError}
        errorPrefix={prefix}
        onSubmit={(values, dirty) =>
          update.mutate(
            { id: task.id, updates: buildTaskUpdates(values, dirty) },
            {
              onSuccess: ({ warning }) =>
                navigate('/', { state: warning ? { notice: warning } : undefined }),
            },
          )
        }
      />
    </div>
  )
}
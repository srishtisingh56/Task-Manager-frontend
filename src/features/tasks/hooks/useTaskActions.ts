import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '@/lib/apiError'
import { toast } from '@/lib/toastStore'
import type { PagedResult } from '@/types/api'
import {
  bulkDeleteTasks, completeTask, deleteTask, haltTask,
  reassignTask, restoreTask, resumeTask,
} from '@/features/tasks/tasksApi'
import type { Task } from '@/features/tasks/types'
import { taskKeys } from './useTasks'

function useRefreshTasks() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: taskKeys.all })
}

export function useHaltTask() {
  const refresh = useRefreshTasks()
  return useMutation({
    mutationFn: haltTask,
    onSuccess: () => toast.success('Task halted'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

export function useResumeTask() {
  const refresh = useRefreshTasks()
  return useMutation({
    mutationFn: resumeTask,
    onSuccess: () => toast.success('Task resumed'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

/** Optimistic: the card flips to Completed instantly, and rolls back if the server refuses. */
export function useCompleteTask() {
  const queryClient = useQueryClient()
  const refresh = useRefreshTasks()

  return useMutation({
    mutationFn: completeTask,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists }) // stop in-flight refetches overwriting us
      const snapshot = queryClient.getQueriesData<PagedResult<Task>>({ queryKey: taskKeys.lists })
      queryClient.setQueriesData<PagedResult<Task>>({ queryKey: taskKeys.lists }, (old) =>
        old
          ? {
              ...old,
              items: old.items.map((t) =>
                t.id === id ? { ...t, status: 'Completed' as const } : t,
              ),
            }
          : old,
      )
      return { snapshot }
    },
    onError: (e, _id, context) => {
      context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data)) // roll back
      toast.error(getErrorMessage(e))
    },
    onSuccess: () => toast.success('Task completed'),
    onSettled: refresh, // either way, the server's version wins
  })
}

/** No error toast: the confirm dialog shows the error inline. */
export function useDeleteTask() {
  const refresh = useRefreshTasks()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_data, id) =>
      toast.undoable('Task deleted', async () => {
        try {
          await restoreTask(id)
          toast.success('Task restored')
        } catch (e) {
          toast.error(getErrorMessage(e))
        } finally {
          void refresh()
        }
      }),
    onSettled: refresh,
  })
}

export function useReassignTask() {
  const refresh = useRefreshTasks()
  return useMutation({
    mutationFn: ({ id, newAssigneeId }: { id: string; newAssigneeId: string }) =>
      reassignTask(id, newAssigneeId),
    onSuccess: () => toast.success('Task reassigned'),
    onSettled: refresh,
  })
}

export function useBulkDeleteTasks() {
  const refresh = useRefreshTasks()
  return useMutation({
    mutationFn: bulkDeleteTasks,
    onSuccess: ({ deletedCount }) =>
      toast.success(
        deletedCount === 0
          ? 'Nothing to delete'
          : `Deleted ${deletedCount} ${deletedCount === 1 ? 'task' : 'tasks'}`,
      ),
    onSettled: refresh,
  })
}
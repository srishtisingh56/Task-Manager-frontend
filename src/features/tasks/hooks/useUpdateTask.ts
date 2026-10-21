import { useMutation, useQueryClient } from '@tanstack/react-query'
import { taskKeys } from './useTasks'
import type { TaskUpdates } from '../types'
import { updateTaskDetails, updateTaskDeadlines, setTaskRepetitive } from '../tasksApi'

export class UpdateTaskError extends Error {
  original: unknown
  saved: string[]
  constructor(original: unknown, saved: string[]) {
    super('Update failed')
    this.original = original
    this.saved = saved
  }
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdates }) => {
      const saved: string[] = []
      let warning: string | null = null
      try {
        if (updates.details) {
          await updateTaskDetails(id, updates.details)
          saved.push('details')
        }
        if (updates.deadlines) {
          const task = await updateTaskDeadlines(id, updates.deadlines)
          warning = task.warning
          saved.push('deadlines')
        }
        if (updates.repetitive !== undefined) {
          await setTaskRepetitive(id, updates.repetitive)
          saved.push('repeat setting')
        }
      } catch (e) {
        throw new UpdateTaskError(e, saved)
      }
      return { warning }
    },
    // onSettled runs on success AND failure, so a half-saved edit still refreshes the cache
    onSettled: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  })
}
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { taskKeys } from './useTasks'
import { createTask } from '../tasksApi'

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  })
}
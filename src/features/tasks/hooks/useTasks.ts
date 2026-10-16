import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchTaskById, fetchTasks, type TaskFilters } from "../tasksApi";

export const taskKeys = {
    all: ['tasks'] as const,
    list:(filters:TaskFilters) => ['tasks', 'list',filters] as const,
    detail:(id:string) => ['tasks', 'detail', id] as const
}

export function useTasks(filters: TaskFilters) {
    return useQuery({
        queryKey:taskKeys.list(filters),
        queryFn: () => fetchTasks(filters),
        placeholderData: keepPreviousData
    })
}

export function useTask(id:string | undefined)
{
    return useQuery({
        queryKey: taskKeys.detail(id ?? ''),
        queryFn: () => fetchTaskById(id ?? ''),
        enabled: !!id
    })
}
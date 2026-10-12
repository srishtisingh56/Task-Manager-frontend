import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchTasks, type TaskFilters } from "./tasksApi";

export const taskKeys = {
    all: ['tasks'] as const,
    list:(filters:TaskFilters) => ['tasks', 'list',filters] as const
}

export function useTasks(filters: TaskFilters) {
    return useQuery({
        queryKey:taskKeys.list(filters),
        queryFn: () => fetchTasks(filters),
        placeholderData: keepPreviousData
    })
}
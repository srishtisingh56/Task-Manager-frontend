import type { PagedResult } from "@/types/api";
import type { Task } from "./types";
import { api } from "@/lib/api";

export interface TaskFilters {
    status?: string;
    pageNumber: number,
    pageSize: number;
}

export async function fetchTasks(filters: TaskFilters) : Promise<PagedResult<Task>> {
    const { data } = await api.get<PagedResult<Task>>('/tasks',{params:filters})
    return data;
}

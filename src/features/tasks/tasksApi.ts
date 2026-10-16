import type { PagedResult, TaskStatus } from "@/types/api";
import type { CreateTaskBody, Task, TaskRelation, TaskUpdates, UpdateDeadlinesBody } from "./types";
import { api } from "@/lib/api";

export interface TaskFilters {
    status?: TaskStatus;
    relation?: TaskRelation
    pageNumber: number
    pageSize: number
}

export async function fetchTasks(filters: TaskFilters) : Promise<PagedResult<Task>> {
    const { data } = await api.get<PagedResult<Task>>('/tasks',{params:filters})
    return data;
}

export async function fetchTaskById(taskId: string): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${taskId}`);
    return data;
}

export async function createTask(body: CreateTaskBody): Promise<Task> {
    const {data} = await api.post<Task>('/tasks',body);
    return data;
}

export async function updateTaskDetails(taskId: string, body: UpdateDeadlinesBody): Promise<Task> {
    const { data } = await api.patch<Task>(`/tasks/${taskId}/details`, body);
    return data;
}

export async function updateTaskDeadlines(taskId: string, body: UpdateDeadlinesBody): Promise<Task> {
    const { data } = await api.patch<Task>(`/tasks/${taskId}/deadlines`, body);
    return data;
}

export async function setTaskRepetitive(taskId: string, isRepetitive: boolean): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${taskId}/repetitive`, { isRepetitive });
    return data;
}

export type { TaskUpdates }

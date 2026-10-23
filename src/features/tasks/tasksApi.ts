import type { PagedResult, TaskStatus } from "@/types/api";
import type { CreateTaskBody, Task, TaskRelation, UpdateDeadlinesBody, UpdateDetailsBody } from "./types";
import { api } from "@/lib/api";

type TaskAction = 'complete' | 'halt' | 'resume' | 'restore'

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

export async function updateTaskDetails(taskId: string, body: UpdateDetailsBody): Promise<Task> {
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

async function postAction(id:string, action: TaskAction): Promise<Task>{
    const { data } = await api.post<Task>(`/tasks/${id}/${action}`);
    return data;
}

export const completeTask = (id:string) => postAction(id,'complete')
export const haltTask = (id:string) => postAction(id,'halt') 
export const resumeTask = (id:string) => postAction(id,'resume')
export const restoreTask = (id:string) => postAction(id,'restore')

export async function deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
}

export async function bulkDeleteTasks(status: TaskStatus): Promise<{deletedCount:number}> {
    const { data } = await api.post<{deletedCount: number}>(`/tasks/bulk-delete`, { status });
    return data;
}

export async function reassignTask(id: string, newAssigneeId: string): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${id}/assignee`, { newAssigneeId });
    return data;
}
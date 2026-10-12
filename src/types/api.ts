export type TaskStatus = 'Pending' | 'Completed' | 'Halted' | 'Overdue';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface PagedResult<T>{
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface ApiProblem{
    status: string,
    title?: string,
    detail?: string,
    instance?: string,
    errors?:Record<string,string[]>
}
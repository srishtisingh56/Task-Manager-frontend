export type TaskStatus = 'Pending' | 'Completed' | 'Halted' | 'Overdue';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type NotificationOffsetUnit = 'Minutes' | 'Hours' | 'Days' | 'Weeks';
export type NotificationRepeatMode = 'Once' | 'Repeat';
export type NotificationChannel = 'App' | 'Email' | 'Sms';
export type NotificationDeliveryStatus = 'Pending' | 'Sent' | 'Failed';
export type NotificationTriggerEvent =
    | 'Created' | 'Updated' | 'Deleted' | 'Completed'
    | 'AfterCreationOffset' | 'BeforeLenientDeadline' | 'BeforeStrictDeadline' | 'StrictDeadlinePassed';

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
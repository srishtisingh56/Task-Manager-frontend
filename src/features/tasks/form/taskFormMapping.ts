import { localInputToUtcIso, toLocalInputValue } from '@/lib/dates'
import type { TaskFormValues } from './taskFormSchema'
import type { CreateTaskBody, Task, TaskUpdates, UpdateDeadlinesBody, UpdateDetailsBody } from '../types'

//if title is updated then its value : true and vice versa
export type DirtyFields = Partial<Record<keyof TaskFormValues,boolean>>

export function emptyTaskForm(myUserId:string) :TaskFormValues
{
    return{
        title: '',
        description: '',
        priority: '',
        lenientDeadline: '',
        strictDeadline: '',
        isRepetitive: false,
        assignedToUserId: myUserId,
    }
}

export function taskToFormValues(task:Task): TaskFormValues{
    return {
        title: task.title,
        description: task.description ?? '',
        priority: task.priority ?? '',
        lenientDeadline: toLocalInputValue(task.lenientDeadline),
        strictDeadline: toLocalInputValue(task.strictDeadline),
        isRepetitive: task.isRepetitive,
        assignedToUserId: task.assignedToUserId,
    }
}

export function toCreateBody(v:TaskFormValues): CreateTaskBody{
    return{
        title: v.title.trim(),
        description: v.description.trim() === '' ? '' : v.description.trim(),
        priority: v.priority === '' ? null : v.priority,
        lenientDeadline: localInputToUtcIso(v.lenientDeadline),
        strictDeadline: localInputToUtcIso(v.strictDeadline),
        isRepetitive: v.isRepetitive,
        assignedToUserId: v.assignedToUserId,
    }
}

export function buildTaskUpdates(v:TaskFormValues, dirty:DirtyFields): TaskUpdates{
    const updates: TaskUpdates = {}

    const details: UpdateDetailsBody = {}
    if(dirty.title) details.title = v.title.trim()
    if(dirty.description) details.description = v.description.trim() === '' ? '' : v.description.trim()
    if(dirty.priority) details.priority = v.priority === '' ? null : v.priority

    const deadlines: UpdateDeadlinesBody = {}
    if(dirty.lenientDeadline) deadlines.lenientDeadline = localInputToUtcIso(v.lenientDeadline)
    if(dirty.strictDeadline) deadlines.strictDeadline = localInputToUtcIso(v.strictDeadline)
    if(Object.keys(deadlines).length > 0) updates.deadlines = deadlines

    if(Object.keys(details).length > 0) updates.details = details
    if(Object.keys(deadlines).length > 0) updates.deadlines = deadlines

    if(dirty.isRepetitive) updates.repetitive = v.isRepetitive
    return updates
}

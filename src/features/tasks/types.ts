import type { TaskStatus, TaskPriority } from '@/types/api'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority | null
  lenientDeadline: string // ISO UTC string
  strictDeadline: string
  isRepetitive: boolean
  createdByUserId: string
  assignedToUserId: string
  //add creater and assignee names
  createdByName: string | null
  assignedToName: string | null
  warning: string | null
}

export const STATUSES: TaskStatus[] = ['Pending', 'Halted', 'Overdue', 'Completed']

export type TaskRelation = 'AssignedToMe' | 'AssignedByMe' | 'Personal'


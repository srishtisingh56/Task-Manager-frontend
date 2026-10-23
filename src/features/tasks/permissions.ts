import type { User } from "../auth/types";
import type { Task } from "./types";

const isCreator = (task: Task, user: User) => task.createdByUserId === user.id;
const isAssignee = (task: Task, user: User) => task.assignedToUserId === user.id;

export const canEditTask = (task: Task, user: User) =>
   isCreator(task, user) && (task.status === 'Pending' || task.status === 'Halted')

export const canCompleteTask = (task: Task, user: User) =>
   (isAssignee(task, user) || isCreator(task, user)) && (task.status === 'Pending' || task.status === 'Overdue')
    
export const canHaltTask = (task:Task,u:User)=> isCreator(task, u) && task.status === 'Pending'
    
export const canResumeTask = (task: Task, u: User) => isCreator(task, u) && task.status === 'Halted'

export const canDeleteTask = (task: Task, u: User) => isCreator(task, u)

export const canReassignTask = (task: Task, u: User) => isCreator(task, u) && task.status !== 'Completed'
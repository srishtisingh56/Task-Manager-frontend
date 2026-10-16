import type { User } from "../auth/types";
import type { Task } from "./types";

export function canEditTask(task:Task,user:User)
{
    const ownsIt = task.createdByUserId === user.id 
    return ownsIt && (task.status === 'Pending' || task.status === 'Halted')
}
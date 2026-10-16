import type { TaskStatus } from "@/types/api";
import type { TaskRelation } from "./types";

export const STATUS_OPTIONS:{label:string; value:TaskStatus|undefined}[] = [
    {label:'Pending',value:'Pending'},
    {label:'Halted',value:'Halted'},
    {label:'Completed',value:'Completed'},
    {label:'Overdue',value:'Overdue'}
]

export const RELATION_OPTIONS:{label:string; value:TaskRelation|undefined}[] = [
    {label:'Assigned to you',value:'AssignedToMe'},
    {label:'Assigned by you',value:'AssignedByMe'},
    {label:'Personal',value:'Personal'}
]
import type { TaskStatus } from "@/types/api";
import { Badge, type BadgeTone } from "@/components/Badge";

const tones: Record<TaskStatus, BadgeTone> = {
    Pending: 'amber',
    Completed: 'green',
    Halted: 'slate',
    Overdue: 'red'
}

type Props = {status: TaskStatus}

export function TaskStatusBadge({ status }: Props) {
  return <Badge tone={tones[status]}>{status}</Badge>
}


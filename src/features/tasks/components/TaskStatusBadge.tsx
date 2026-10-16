import type { TaskStatus } from "@/types/api";

const styles: Record<TaskStatus, string> = {
    Pending:'bg-amber-500/15 text-amber-300',
    Completed:'bg-emerald-500/15 text-emerald-300',
    Halted:'bg-slate-500/15 text-slate-300',
    Overdue:'bg-red-500/15 text-red-300'
}

type Props = {status: TaskStatus}

export function TaskStatusBadge({ status }: Props) {
  return (
    <span className={'rounded-full px-2.5 py-0.5 text-xs font-medium ' + styles[status]}>
      {status}
    </span>
  )
}


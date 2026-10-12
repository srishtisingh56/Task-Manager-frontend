import type { TaskStatus } from '@/types/api'
import { STATUSES } from './types'

type Props = {
  value: TaskStatus | undefined
  onChange: (status: TaskStatus | undefined) => void
}

export function StatusFilter({ value, onChange }: Props) {
  const tabs: { label: string; value: TaskStatus | undefined }[] = [
    { label: 'All', value: undefined },
    ...STATUSES.map((s) => ({ label: s, value: s })),
  ]

  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.label}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition ${
              active
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
import type { ReactNode } from 'react'

export type BadgeTone = 'green' | 'red' | 'amber' | 'slate' | 'indigo'

const tones: Record<BadgeTone, string> = {
  green: 'bg-emerald-500/15 text-emerald-300',
  red: 'bg-red-500/15 text-red-300',
  amber: 'bg-amber-500/15 text-amber-300',
  slate: 'bg-slate-500/15 text-slate-300',
  indigo: 'bg-indigo-500/15 text-indigo-300',
}

export function Badge({ tone = 'slate', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-block shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

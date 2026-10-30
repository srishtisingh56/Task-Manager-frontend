import { useRef, useEffect, useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Pagination } from '@/components/Pagination'
import { getErrorMessage } from '@/lib/apiError'
import {
  useCreateNotificationRule,
  useDeleteNotificationRule,
  useNotificationRulesForTask,
  useUpdateNotificationRule,
} from '../hooks/useNotificationRules'
import { buildUpdateBody, emptyRuleForm, ruleToFormValues, toCreateBody } from '../form/ruleFormMapping'
import { TRIGGER_EVENT_OPTIONS } from '../form/ruleFormSchema'
import { NotificationRuleForm } from './NotificationRuleForm'
import type { NotificationRule } from '../types'

const PAGE_SIZE = 10

function describeRule(rule: NotificationRule): string {
  const label = TRIGGER_EVENT_OPTIONS.find((o) => o.value === rule.triggerEvent)?.label ?? rule.triggerEvent
  const offset = rule.offsetValue && rule.offsetUnit ? `${rule.offsetValue} ${rule.offsetUnit.toLowerCase()}` : '—'
  return `${label} · ${offset} · ${rule.repeatMode}`
}

type Props = { taskId: string; autoOpenCreate?: boolean; readOnly?: boolean }

export function NotificationRulesSection({ taskId, autoOpenCreate, readOnly }: Props) {
    
  const sectionRef = useRef<HTMLElement>(null)
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(!!autoOpenCreate)
  const [editing, setEditing] = useState<NotificationRule | null>(null)
  const [deleting, setDeleting] = useState<NotificationRule | null>(null)

  useEffect(() => {
    if (autoOpenCreate) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [autoOpenCreate])

  const { data, isPending, isError, error, isPlaceholderData } = useNotificationRulesForTask(taskId, {
    pageNumber: page,
    pageSize: PAGE_SIZE,
  })
  const create = useCreateNotificationRule(taskId)
  const update = useUpdateNotificationRule(taskId)
  const del = useDeleteNotificationRule(taskId)

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  return (
    <section id="reminders" className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Reminders</h2>
        {!readOnly && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Add reminder
          </button>
        )}
      </div>

      {isPending ? (
        <p className="text-sm text-slate-400">Loading reminders…</p>
      ) : isError ? (
        <p role="alert" className="text-sm text-red-300">{getErrorMessage(error)}</p>
      ) : data.items.length === 0 ? (
        <p className="text-sm text-slate-500">No reminders configured for this task yet.</p>
      ) : (
        <ul className={`space-y-2 transition-opacity ${isPlaceholderData ? 'opacity-60' : ''}`}>
          {data.items.map((rule) => (
            <li
              key={rule.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300"
            >
              <span>{describeRule(rule)}</span>
              {!readOnly && (
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(rule)} className="text-indigo-400 hover:text-indigo-300">
                    Edit
                  </button>
                  <button type="button" onClick={() => setDeleting(rule)} className="text-red-400 hover:text-red-300">
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} disabled={isPending || isPlaceholderData} />

      {creating && (
        <NotificationRuleForm
          mode="create"
          title="Add reminder"
          defaultValues={emptyRuleForm()}
          isSubmitting={create.isPending}
          error={create.error}
          onClose={() => { create.reset(); setCreating(false) }}
          onSubmit={(values) => create.mutate(toCreateBody(values), { onSuccess: () => setCreating(false) })}
        />
      )}

      {editing && (
        <NotificationRuleForm
          mode="edit"
          title="Edit reminder"
          defaultValues={ruleToFormValues(editing)}
          isSubmitting={update.isPending}
          error={update.error}
          onClose={() => { update.reset(); setEditing(null) }}
          onSubmit={(values, dirty) =>
            update.mutate(
              { ruleId: editing.id, body: buildUpdateBody(values, dirty) },
              { onSuccess: () => setEditing(null) },
            )
          }
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this reminder?"
          confirmLabel="Delete"
          destructive
          isPending={del.isPending}
          errorMessage={del.isError ? getErrorMessage(del.error) : undefined}
          onCancel={() => { del.reset(); setDeleting(null) }}
          onConfirm={() => del.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        >
          <p>This removes the "{describeRule(deleting)}" reminder. This can't be undone.</p>
        </ConfirmDialog>
      )}
    </section>
  )
}

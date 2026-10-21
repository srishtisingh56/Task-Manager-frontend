import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Field, inputClass } from '@/components/Field'
import { getErrorMessage, getFieldErrors } from '@/lib/apiError'
import { FIELD_NAMES, makeTaskFormSchema, type TaskFormValues } from '../form/taskFormSchema'
import type { DirtyFields } from '../form/taskFormMapping'

type Props = {
  mode: 'create' | 'edit'
  defaultValues: TaskFormValues
  assigneeOptions: { id: string; label: string }[]
  submitLabel: string
  isSubmitting: boolean
  error: unknown
  errorPrefix?: string
  onSubmit: (values: TaskFormValues, dirty: DirtyFields) => void
}

export function TaskForm({
  mode, defaultValues, assigneeOptions, submitLabel,
  isSubmitting, error, errorPrefix, onSubmit,
}: Props) {
  const schema = useMemo(
    () => makeTaskFormSchema(mode === 'edit' ? defaultValues.strictDeadline : undefined),
    [mode, defaultValues.strictDeadline],
  )

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<TaskFormValues>({ resolver: zodResolver(schema), defaultValues })

  // Show the server's field-level errors under the matching inputs
  useEffect(() => {
    if (!error) return
    for (const [name, message] of Object.entries(getFieldErrors(error))) {
      if ((FIELD_NAMES as readonly string[]).includes(name)) {
        setError(name as keyof TaskFormValues, { type: 'server', message })
      }
    }
  }, [error, setError])

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values, dirtyFields))}
      noValidate
      className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      {!!error && (
        <div role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errorPrefix}
          {getErrorMessage(error)}
        </div>
      )}

      <Field label="Title" htmlFor="title" error={errors.title?.message}>
        <input id="title" {...register('title')} className={inputClass} />
      </Field>

      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <textarea id="description" rows={3} {...register('description')} className={inputClass} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Priority" htmlFor="priority" error={errors.priority?.message}>
          <select id="priority" {...register('priority')} className={inputClass}>
            <option value="">No priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </Field>

        <Field
          label="Assign to"
          htmlFor="assignedToUserId"
          error={errors.assignedToUserId?.message}
          hint={mode === 'edit' ? 'Reassigning comes in a later step.' : undefined}
        >
          <select
            id="assignedToUserId"
            disabled={mode === 'edit'}
            {...register('assignedToUserId')}
            className={inputClass}
          >
            {assigneeOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Lenient deadline"
          htmlFor="lenientDeadline"
          error={errors.lenientDeadline?.message}
          hint="Reminders start after this."
        >
          <input id="lenientDeadline" type="datetime-local" {...register('lenientDeadline')} className={inputClass} />
        </Field>

        <Field
          label="Strict deadline"
          htmlFor="strictDeadline"
          error={errors.strictDeadline?.message}
          hint="The task becomes Overdue after this."
        >
          <input id="strictDeadline" type="datetime-local" {...register('strictDeadline')} className={inputClass} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" {...register('isRepetitive')} className="h-4 w-4 accent-indigo-500" />
        Repeating task
      </label>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link to="/" className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting || (mode === 'edit' && !isDirty)}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
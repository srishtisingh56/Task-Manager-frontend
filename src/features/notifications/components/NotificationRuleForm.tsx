import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, inputClass } from '@/components/Field'
import { Modal } from '@/components/Model'
import { getErrorMessage, getFieldErrors } from '@/lib/apiError'
import {
  FIELD_NAMES,
  OFFSET_UNIT_OPTIONS,
  REPEAT_MODE_OPTIONS,
  TRIGGER_EVENT_OPTIONS,
  ruleFormSchema,
  type RuleFormValues,
} from '../form/ruleFormSchema'
import type { DirtyFields } from '../form/ruleFormMapping'

type Props = {
  mode: 'create' | 'edit'
  title: string
  defaultValues: RuleFormValues
  isSubmitting: boolean
  error: unknown
  onSubmit: (values: RuleFormValues, dirty: DirtyFields) => void
  onClose: () => void
}

export function NotificationRuleForm({
  mode, title, defaultValues, isSubmitting, error, onSubmit, onClose,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<RuleFormValues>({ resolver: zodResolver(ruleFormSchema), defaultValues })

  useEffect(() => {
    if (!error) return
    for (const [name, message] of Object.entries(getFieldErrors(error))) {
      if ((FIELD_NAMES as readonly string[]).includes(name)) {
        setError(name as keyof RuleFormValues, { type: 'server', message })
      }
    }
  }, [error, setError])

  const triggerEvent = watch('triggerEvent')
  const repeatDisabled = triggerEvent !== 'AfterCreationOffset'

  return (
    <Modal title={title} onClose={onClose} busy={isSubmitting}>
      <form
        onSubmit={handleSubmit((values) => onSubmit(values, dirtyFields))}
        noValidate
        className="space-y-4"
      >
        {!!error && (
          <div role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {getErrorMessage(error)}
          </div>
        )}

        <Field label="When" htmlFor="triggerEvent" error={errors.triggerEvent?.message}>
          <select
            id="triggerEvent"
            disabled={mode === 'edit'}
            {...register('triggerEvent')}
            className={inputClass}
          >
            {TRIGGER_EVENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Offset value" htmlFor="offsetValue" error={errors.offsetValue?.message}>
            <input
              id="offsetValue"
              type="number"
              min={1}
              {...register('offsetValue', { valueAsNumber: true })}
              className={inputClass}
            />
          </Field>
          <Field label="Offset unit" htmlFor="offsetUnit" error={errors.offsetUnit?.message}>
            <select id="offsetUnit" {...register('offsetUnit')} className={inputClass}>
              {OFFSET_UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Repeat"
          htmlFor="repeatMode"
          error={errors.repeatMode?.message}
          hint={repeatDisabled ? 'Deadline reminders can only fire once.' : undefined}
        >
          <select
            id="repeatMode"
            disabled={repeatDisabled}
            {...register('repeatMode')}
            className={inputClass}
          >
            {REPEAT_MODE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (mode === 'edit' && !isDirty)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : mode === 'create' ? 'Add reminder' : 'Save changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

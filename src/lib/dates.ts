
export function parseUtc(iso: string):Date {
  return new Date(/[zZ]$|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`)
}

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle:'medium',
  timeStyle:'short'
})

export function formatDateTime(iso:string):string{
  return dateTimeFormat.format(parseUtc(iso))
}

const pad = (n: number) => String(n).padStart(2, '0')

/** API UTC string -> value for datetime-local input, shown in the user's local time. */
export function toLocalInputValue(iso: string): string {
  const d = parseUtc(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** datetime-local value (local time) -> UTC ISO string with "Z", ready for the API. */
export function localInputToUtcIso(value: string): string {
  return new Date(value).toISOString()
}
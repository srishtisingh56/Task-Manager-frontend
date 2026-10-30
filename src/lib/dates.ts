
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

const relativeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000], ['month', 2_592_000], ['week', 604_800], ['day', 86_400], ['hour', 3_600], ['minute', 60],
]

/** "5 minutes ago", "in 2 days" — pair with formatDateTime in a title for the exact time. */
export function formatRelative(iso: string): string {
  const seconds = (parseUtc(iso).getTime() - Date.now()) / 1000
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relativeFormat.format(Math.round(seconds / size), unit)
  }
  return 'just now'
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
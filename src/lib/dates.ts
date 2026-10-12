
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
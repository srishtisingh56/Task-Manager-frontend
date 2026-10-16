type Option<T extends string> = {
    label: string,
    value: T | undefined
}

type Props<T extends string> = {
    label:string,
    options:Option<T>[]
    value:T | undefined
    onChange:(value:T | undefined) => void
}

export function FilterTabs<T extends string>({label, options, value, onChange}: Props<T>) {
    return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            title={active ? 'Click again to clear' : undefined}
            onClick={() => onChange(active ? undefined : opt.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition ${
              active ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
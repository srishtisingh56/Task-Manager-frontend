type Props = {
    page:number,
    totalPages:number,
    onChange: (page:number) => void
    disabled?:boolean
}

export function Pagination({ page, totalPages, onChange, disabled }: Props) {
    if(totalPages<=1)
        return null

    const btn = 'rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent'

     return (
    <div className="flex items-center justify-between pt-4">
      <button className={btn} disabled={disabled || page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span className="text-sm text-slate-400">
        Page {page} of {totalPages}
      </span>
      <button
        className={btn}
        disabled={disabled || page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  )
}
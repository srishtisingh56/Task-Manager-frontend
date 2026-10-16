export const inputClass = 
'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-indigo-500 disabled:opacity-60 '

type Props = {
    label:string
    htmlFor:string
    error?:string
    hint?:string
    children:React.ReactNode
}

export function Field({ label, htmlFor, error, hint, children }: Props) {
    return(
        <div className="space-y-1.5"> 
            <label htmlFor={htmlFor} className="text-sm text-slate-300">
                {label}
            </label>
            {children}
            {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    )
}
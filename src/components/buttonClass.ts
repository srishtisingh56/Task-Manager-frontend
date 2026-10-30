export type ButtonVariant = 'primary' | 'destructive' | 'secondary' | 'danger' | 'ghost' | 'success'
export type ButtonSize = 'sm' | 'md'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 font-medium text-white hover:bg-indigo-500',
  destructive: 'bg-red-600 font-medium text-white hover:bg-red-500',
  secondary: 'border border-slate-700 text-slate-200 hover:bg-slate-800',
  danger: 'text-red-300 hover:bg-red-500/10',
  success: 'text-emerald-300 hover:bg-emerald-500/10',
  ghost: 'text-slate-300 hover:bg-slate-800',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
}

/** Also usable on <Link> so links and buttons look identical. */
export function buttonClass(variant: ButtonVariant = 'secondary', size: ButtonSize = 'md', extra = '') {
  return `inline-flex items-center justify-center rounded-lg text-sm transition disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${variants[variant]} ${sizes[size]} ${extra}`
}

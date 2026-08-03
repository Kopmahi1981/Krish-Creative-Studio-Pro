import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-foreground-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full rounded-xl border bg-white/5 px-3.5 py-2.5 text-sm text-foreground outline-none transition',
          'placeholder:text-foreground-muted focus:border-brand-purple/60 focus:shadow-neon-purple',
          error ? 'border-brand-rose/70' : 'border-white/10',
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-brand-rose">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-foreground-muted">{hint}</p>
      ) : null}
    </div>
  )
})

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, rows = 4, ...props },
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
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full resize-y rounded-xl border bg-white/5 px-3.5 py-2.5 text-sm text-foreground outline-none transition',
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

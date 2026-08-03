import { cn } from '@/utils/cn'

interface TemplateTagProps {
  label: string
  className?: string
}

/**
 * Standardized tag pill used across cards and the preview modal.
 * Equal height, padding, border radius, and typography everywhere.
 */
export function TemplateTag({ label, className }: TemplateTagProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full border border-white/10 bg-white/5 px-2.5 text-[11px] font-medium text-foreground-secondary',
        className,
      )}
    >
      {label}
    </span>
  )
}

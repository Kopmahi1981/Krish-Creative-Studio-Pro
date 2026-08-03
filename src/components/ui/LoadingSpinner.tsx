import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: number
  className?: string
  label?: string
}

export function LoadingSpinner({ size = 24, className, label }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2 text-foreground-secondary', className)} role="status">
      <Loader2 className="animate-spin text-brand-cyan" style={{ width: size, height: size }} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}

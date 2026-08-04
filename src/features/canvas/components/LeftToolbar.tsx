import { MousePointer2, Type, Image as ImageIcon, Square, Hand } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { CanvasTool } from '../models/editor'

interface LeftToolbarProps {
  active: CanvasTool
  onChange: (tool: CanvasTool) => void
}

const TOOLS: { id: CanvasTool; label: string; Icon: typeof MousePointer2; disabled?: boolean }[] = [
  { id: 'select', label: 'Select', Icon: MousePointer2 },
  { id: 'text', label: 'Add text', Icon: Type },
  { id: 'image', label: 'Add image (coming soon)', Icon: ImageIcon, disabled: true },
  { id: 'shape', label: 'Add shape (coming soon)', Icon: Square, disabled: true },
  { id: 'hand', label: 'Pan', Icon: Hand },
]

/** Vertical tool rail. Tool selection is visual-only in Phase 4.1. */
export function LeftToolbar({ active, onChange }: LeftToolbarProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 border-r border-white/10 bg-surface/40 p-2">
      {TOOLS.map(({ id, label, Icon, disabled }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            aria-label={label}
            aria-pressed={isActive}
            aria-disabled={disabled || undefined}
            title={label}
            onClick={() => !disabled && onChange(id)}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-xl border transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60',
              disabled
                ? 'cursor-not-allowed border-transparent text-foreground-muted/40 opacity-50'
                : isActive
                  ? 'border-brand-purple/50 bg-brand-purple/15 text-brand-purple shadow-neon-purple'
                  : 'border-transparent text-foreground-secondary hover:bg-white/10 hover:text-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
          </button>
        )
      })}
    </div>
  )
}

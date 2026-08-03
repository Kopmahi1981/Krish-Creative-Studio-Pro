import { useId } from 'react'
import { useControllableState } from '@/hooks'
import { cn } from '@/utils/cn'

interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  label?: string
  className?: string
}

const PRESETS = ['#f43f5e', '#a855f7', '#22d3ee', '#10b981', '#f59e0b', '#ffffff', '#0f172a', '#000000']

export function ColorPicker({
  value,
  defaultValue = '#a855f7',
  onChange,
  label,
  className,
}: ColorPickerProps) {
  const autoId = useId()
  const [current, setCurrent] = useControllableState<string>({
    value,
    defaultValue,
    onChange,
  })

  return (
    <div className={cn('w-full', className)}>
      {label && <p className="mb-1.5 text-sm font-medium text-foreground-secondary">{label}</p>}
      <div className="flex items-center gap-2">
        <label className="relative h-9 w-9 cursor-pointer overflow-hidden rounded-lg border border-white/15">
          <span className="absolute inset-0" style={{ backgroundColor: current }} />
          <input
            id={autoId}
            type="color"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <input
          type="text"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="w-24 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-foreground outline-none focus:border-brand-purple/60"
          aria-label="Hex color value"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-label={`Select ${preset}`}
            onClick={() => setCurrent(preset)}
            className={cn(
              'h-6 w-6 rounded-md border transition',
              current.toLowerCase() === preset.toLowerCase()
                ? 'border-white ring-2 ring-brand-purple/60'
                : 'border-white/15 hover:scale-110',
            )}
            style={{ backgroundColor: preset }}
          />
        ))}
      </div>
    </div>
  )
}

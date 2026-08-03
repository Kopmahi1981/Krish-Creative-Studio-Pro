import { useId } from 'react'
import { useControllableState } from '@/hooks'
import { cn } from '@/utils/cn'

interface SliderProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  disabled?: boolean
  label?: string
  className?: string
}

export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  label,
  className,
}: SliderProps) {
  const autoId = useId()
  const [current, setCurrent] = useControllableState<number>({
    value,
    defaultValue,
    onChange,
  })

  const percent = max === min ? 0 : ((current - min) / (max - min)) * 100

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground-secondary">{label}</span>
          <span className="tabular-nums text-foreground-muted">{current}</span>
        </div>
      )}
      <input
        type="range"
        id={autoId}
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        onChange={(e) => setCurrent(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 outline-none
          [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br
          [&::-webkit-slider-thumb]:from-brand-rose [&::-webkit-slider-thumb]:to-brand-purple
          [&::-webkit-slider-thumb]:shadow-neon-purple
          [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-purple"
        style={{
          background: `linear-gradient(to right, rgba(168,85,247,0.7) ${percent}%, rgba(255,255,255,0.1) ${percent}%)`,
        }}
      />
    </div>
  )
}

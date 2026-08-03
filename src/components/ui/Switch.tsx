import { useControllableState } from '@/hooks'
import { cn } from '@/utils/cn'

interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  id?: string
}

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  id,
}: SwitchProps) {
  const [isChecked, setChecked] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange,
  })

  return (
    <label className={cn('inline-flex items-center gap-2', disabled && 'cursor-not-allowed opacity-60')} htmlFor={id}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={() => setChecked(!isChecked)}
        className={cn(
          'relative h-6 w-11 rounded-full border border-white/10 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60',
          isChecked ? 'bg-gradient-to-r from-brand-rose to-brand-purple shadow-neon-purple' : 'bg-white/10',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform',
            isChecked && 'translate-x-5',
          )}
        />
      </button>
      {label && <span className="text-sm text-foreground-secondary">{label}</span>}
    </label>
  )
}

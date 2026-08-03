import { type ReactNode, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useClickOutside } from '@/hooks'
import { cn } from '@/utils/cn'

export interface DropdownOption {
  label: string
  value: string
  icon?: ReactNode
  disabled?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  options: DropdownOption[]
  onSelect: (value: string) => void
  align?: 'start' | 'end'
  className?: string
}

export function Dropdown({ trigger, options, onSelect, align = 'end', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false), open)

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            role="menu"
            className={cn(
              'absolute z-50 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-surface/90 p-1 shadow-glass backdrop-blur-2xl',
              align === 'end' ? 'right-0' : 'left-0',
            )}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="menuitem"
                disabled={opt.disabled}
                onClick={() => {
                  onSelect(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground-secondary transition',
                  'hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40',
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

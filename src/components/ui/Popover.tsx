import { type ReactNode, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useClickOutside } from '@/hooks'
import { cn } from '@/utils/cn'

interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  /** Keep the popover open (e.g. for interactive content). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  align?: 'start' | 'end'
  /** Class applied to the outer trigger wrapper. */
  className?: string
  /** Class applied to the floating panel (e.g. width, padding). */
  panelClassName?: string
}

export function Popover({ trigger, children, open: controlled, onOpenChange, align = 'end', className, panelClassName }: PopoverProps) {
  const [internal, setInternal] = useState(false)
  const isControlled = controlled !== undefined
  const open = isControlled ? controlled : internal
  const ref = useRef<HTMLDivElement>(null)

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternal(next)
    onOpenChange?.(next)
  }

  useClickOutside(ref, () => setOpen(false), open)

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.14 }}
            role="dialog"
            className={cn(
              'absolute z-50 mt-2 w-64 rounded-xl border border-white/10 bg-surface/90 p-3 text-sm text-foreground shadow-glass backdrop-blur-2xl',
              align === 'end' ? 'right-0' : 'left-0',
              panelClassName,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

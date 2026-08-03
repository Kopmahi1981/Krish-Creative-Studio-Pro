import { type ReactNode, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Portal } from './Portal'
import { useLockBodyScroll } from '@/hooks'
import { cn } from '@/utils/cn'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'left' | 'right'
  /** Tailwind width class, e.g. 'w-80'. */
  width?: string
}

export function Drawer({ open, onClose, title, children, side = 'right', width = 'w-80' }: DrawerProps) {
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const offscreen = side === 'right' ? '100%' : '-100%'

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
            <motion.aside
              initial={{ x: offscreen }}
              animate={{ x: 0 }}
              exit={{ x: offscreen }}
              transition={{ type: 'tween', duration: 0.25 }}
              className={cn(
                'absolute inset-y-0 flex flex-col border-white/10 bg-surface/85 p-5 shadow-glass backdrop-blur-2xl',
                side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
                width,
              )}
              role="dialog"
              aria-modal="true"
            >
              <div className="mb-4 flex items-center justify-between">
                {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-foreground-secondary transition hover:bg-white/10 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin text-sm text-foreground-secondary">{children}</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}

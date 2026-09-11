import { type ReactNode, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Portal } from './Portal'
import { useLockBodyScroll } from '@/hooks'
import { cn } from '@/utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  /** Tailwind max-width class, e.g. 'max-w-lg'. */
  size?: string
}

export function Modal({ open, onClose, title, children, footer, size = 'max-w-lg' }: ModalProps) {
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.18 }}
              role="dialog"
              aria-modal="true"
              className={cn(
                'relative flex max-h-[calc(100vh-2rem)] w-full flex-col rounded-2xl border border-white/10 bg-surface/90 p-5 shadow-glass backdrop-blur-2xl',
                size,
              )}
            >
              <div className="mb-4 flex shrink-0 items-center justify-between">
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
              <div className="min-h-0 flex-1 overflow-y-auto pr-1 text-sm text-foreground-secondary scrollbar-thin">
                {children}
              </div>
              {footer && <div className="mt-5 flex shrink-0 justify-end gap-2">{footer}</div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}

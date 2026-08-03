import { useEffect } from 'react'

/**
 * Toggle `overflow: hidden` on <body> while `locked` is true.
 * Restores the previous value on cleanup so other code's scroll state is preserved.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}

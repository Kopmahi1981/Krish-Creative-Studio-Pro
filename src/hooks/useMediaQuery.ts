import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query and return whether it currently matches.
 * Used by the app shell to switch between collapsed (mobile) and expanded (desktop)
 * sidebar behavior. SSR-safe: defaults to `false` until mounted in the browser.
 *
 * @param query - A valid CSS media query string, e.g. "(min-width: 1024px)".
 * @returns `true` when the query matches, otherwise `false`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQueryList = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)

    setMatches(mediaQueryList.matches)
    mediaQueryList.addEventListener('change', onChange)

    return () => mediaQueryList.removeEventListener('change', onChange)
  }, [query])

  return matches
}

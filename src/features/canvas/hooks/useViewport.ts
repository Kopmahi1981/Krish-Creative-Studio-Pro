import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CanvasSize } from '../models/editor'
import {
  computeFitScale,
  clampUserZoom,
  clampScale,
  ZOOM_FACTOR,
  ZOOM_MIN,
} from '../models/viewport'

interface UseViewportResult {
  /** Automatic fit scale derived from container + size (read-only). */
  fitScale: number
  /** User-controlled zoom multiplier (1 = fit). */
  userZoom: number
  /** Effective rendered scale = fitScale × userZoom. */
  scale: number
  /** Ref to attach to the scrollable workspace element (for measuring + centering). */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Recompute fit and reset the user zoom to 1, then center. */
  fitToScreen: () => void
  /** Smoothly zoom in (multiplicative) until ZOOM_MAX. */
  zoomIn: () => void
  /** Smoothly zoom out (multiplicative) until ZOOM_MIN. */
  zoomOut: () => void
  /** Set the user zoom to a preset multiplier (e.g. 1 = 100%). */
  setUserZoom: (next: number) => void
}

/**
 * Professional viewport manager — Fit Scale SEPARATED from User Zoom.
 *
 * - `fitScale` is computed automatically for each canvas size and on every
 *   container resize. It is derived purely from geometry; the user never touches it.
 * - `userZoom` is an independent multiplier the user controls (presets + smooth
 *   in/out). The EFFECTIVE scale = fitScale × userZoom is what is rendered and
 *   shown as a percentage.
 * - Clicking Fit recomputes fitScale, resets userZoom to 1, and centers.
 * - Changing canvas size recomputes fitScale fresh and resets userZoom to 1, so a
 *   new size never inherits the previous canvas's zoom.
 *
 * UI/measurement only — it does not edit element geometry.
 */
export function useViewport(size: CanvasSize): UseViewportResult {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fitScale, setFitScale] = useState(ZOOM_MIN)
  const [userZoom, setUserZoomState] = useState(1)

  // Keep latest size in a ref so the ResizeObserver callback stays stable.
  const sizeRef = useRef(size)
  sizeRef.current = size
  // Keep latest fitScale in a ref so zoom clamps use the current value.
  const fitScaleRef = useRef(fitScale)
  fitScaleRef.current = fitScale

  const measure = useCallback(() => {
    const el = containerRef.current
    if (!el) return { width: 0, height: 0 }
    const rect = el.getBoundingClientRect()
    return { width: rect.width, height: rect.height }
  }, [])

  const centerArtboard = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2
  }, [])

  const recomputeFit = useCallback(() => {
    const { width, height } = measure()
    const nextFit = computeFitScale(sizeRef.current, width, height)
    setFitScale(nextFit)
    return nextFit
  }, [measure])

  // Fit = recompute fit scale AND reset user zoom to 1, then center.
  const fitToScreen = useCallback(() => {
    recomputeFit()
    setUserZoomState(1)
    requestAnimationFrame(centerArtboard)
  }, [recomputeFit, centerArtboard])

  const setUserZoom = useCallback((next: number) => {
    setUserZoomState((_) => clampUserZoom(next, fitScaleRef.current))
  }, [])

  const zoomIn = useCallback(() => {
    setUserZoomState((z) => clampUserZoom(z * ZOOM_FACTOR, fitScaleRef.current))
  }, [])

  const zoomOut = useCallback(() => {
    setUserZoomState((z) => clampUserZoom(z / ZOOM_FACTOR, fitScaleRef.current))
  }, [])

  // Auto-fit on mount, on container resize, and when the canvas size changes
  // (recompute fit fresh + reset user zoom so the new size doesn't inherit zoom).
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      recomputeFit()
      requestAnimationFrame(centerArtboard)
    })
    ro.observe(el)
    recomputeFit()
    setUserZoomState(1)
    requestAnimationFrame(centerArtboard)
    return () => ro.disconnect()
  }, [recomputeFit, centerArtboard, size.width, size.height])

  const scale = useMemo(() => clampScale(fitScale * userZoom), [fitScale, userZoom])

  return {
    fitScale,
    userZoom,
    scale,
    containerRef,
    fitToScreen,
    zoomIn,
    zoomOut,
    setUserZoom,
  }
}

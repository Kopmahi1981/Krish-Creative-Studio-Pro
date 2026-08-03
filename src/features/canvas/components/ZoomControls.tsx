import { ZoomIn, ZoomOut, Maximize, ChevronDown } from 'lucide-react'
import { IconButton } from '@/components/ui'
import { PRESET_ZOOMS } from '../models/viewport'

interface ZoomControlsProps {
  /** Effective rendered scale (fitScale × userZoom). Drives the displayed %. */
  scale: number
  onZoomIn: () => void
  onZoomOut: () => void
  /** Recompute fit, reset zoom to 100% (fit), and center. */
  onFit: () => void
  /** Set the user-zoom multiplier to a preset (1 = 100% / fit). */
  onSelectPreset: (multiplier: number) => void
}

const PRESET_LABELS = PRESET_ZOOMS.map((z) => ({
  value: String(z),
  label: `${Math.round(z * 100)}%`,
}))

/**
 * Zoom cluster: out / percentage (preset dropdown) / in / fit.
 * The percentage shown always equals the effective rendered scale, so the label
 * and the actual artboard scale can never drift apart.
 */
export function ZoomControls({ scale, onZoomIn, onZoomOut, onFit, onSelectPreset }: ZoomControlsProps) {
  const pct = Math.round(scale * 100)
  // Snap the dropdown selection to the nearest preset for highlighting.
  const nearest = PRESET_ZOOMS.reduce((best, z) =>
    Math.abs(z - scale) < Math.abs(best - scale) ? z : best,
  )
  const nearestLabel = `${Math.round(nearest * 100)}%`

  return (
    <div className="flex items-center gap-1">
      <IconButton label="Zoom out" size="sm" onClick={onZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </IconButton>

      <div className="relative">
        <select
          aria-label="Zoom level"
          value={String(nearest)}
          onChange={(e) => onSelectPreset(Number(e.target.value))}
          className="appearance-none rounded-lg border border-white/10 bg-white/5 py-1.5 pl-3 pr-7 text-xs font-medium tabular-nums text-foreground-secondary outline-none transition hover:bg-white/10 focus:border-brand-purple/60"
        >
          {PRESET_LABELS.map((p) => (
            <option key={p.value} value={p.value} className="bg-surface text-foreground">
              {p.label}
            </option>
          ))}
          {/* Keep the live value visible even if it sits between presets. */}
          {Math.abs(Number(nearestLabel.replace('%', '')) - pct) >= 1 && (
            <option value="__live" disabled className="bg-surface text-foreground">
              {pct}%
            </option>
          )}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted" />
      </div>

      <IconButton label="Zoom in" size="sm" onClick={onZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </IconButton>
      <IconButton label="Fit to screen" size="sm" onClick={onFit}>
        <Maximize className="h-4 w-4" />
      </IconButton>
    </div>
  )
}

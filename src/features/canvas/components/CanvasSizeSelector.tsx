import { Select } from '@/components/ui'
import { CANVAS_SIZES } from '../models/sizes'
import type { CanvasSizeId } from '../models/editor'

interface CanvasSizeSelectorProps {
  value: CanvasSizeId
  onChange: (id: CanvasSizeId) => void
}

/** Top-bar control to switch the artboard's intrinsic output size. */
export function CanvasSizeSelector({ value, onChange }: CanvasSizeSelectorProps) {
  return (
    <Select
      aria-label="Canvas size"
      value={value}
      onChange={(e) => onChange(e.target.value as CanvasSizeId)}
      options={CANVAS_SIZES.map((s) => ({
        value: s.id,
        label: `${s.label} · ${s.width}×${s.height}`,
      }))}
      className="w-52"
    />
  )
}

import { Select } from '@/components/ui'
import { CANVAS_SIZES } from '../models/sizes'
import type { CanvasSizeId } from '../models/editor'
import { t, useLanguage } from '@/i18n'

interface CanvasSizeSelectorProps {
  value: CanvasSizeId
  onChange: (id: CanvasSizeId) => void
}

/** Top-bar control to switch the artboard's intrinsic output size. */
export function CanvasSizeSelector({ value, onChange }: CanvasSizeSelectorProps) {
  useLanguage()
  return (
    <Select
      aria-label="Canvas size"
      value={value}
      onChange={(e) => onChange(e.target.value as CanvasSizeId)}
      options={CANVAS_SIZES.map((s) => ({
        value: s.id,
        label: t(`size.${s.id}`),
      }))}
      className="w-52"
    />
  )
}

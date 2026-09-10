import { Select } from '@/components/ui'
import { CANVAS_SIZE_GROUPS } from '../models/sizes'
import type { CanvasSizeId } from '../models/editor'
import { formatDimensions, formatLabel } from '@/features/platforms'
import { resolve, useLanguage } from '@/i18n'

interface CanvasSizeSelectorProps {
  value: CanvasSizeId
  onChange: (id: CanvasSizeId) => void
}

/**
 * Label resolution for a size option.
 *
 * The five legacy sizes keep their existing translated `size.*` keys so EN/TE/HI
 * localization is unchanged. Registry formats that have no translation key yet
 * fall back to registry data ("Instagram · Story · 1080×1920") rather than
 * rendering a raw key.
 */
function optionLabel(id: string, lang: Parameters<typeof resolve>[1]): string {
  const key = `size.${id}`
  const translated = resolve(key, lang)
  if (translated !== key) return translated
  return `${formatLabel(id)} · ${formatDimensions(id)}`
}

/**
 * Top-bar control to switch the artboard's intrinsic output size.
 *
 * Phase 5.1: options are DERIVED from the Platform & Format Registry and
 * grouped by platform. The component contains no platform-specific logic —
 * adding a platform or format is a data-only change.
 */
export function CanvasSizeSelector({ value, onChange }: CanvasSizeSelectorProps) {
  const lang = useLanguage()

  const options = CANVAS_SIZE_GROUPS.flatMap((group) =>
    group.sizes.map((size) => ({
      value: size.id,
      label: optionLabel(size.id, lang),
    })),
  )

  return (
    <Select
      aria-label="Canvas size"
      value={value}
      onChange={(e) => onChange(e.target.value as CanvasSizeId)}
      options={options}
      className="w-48 sm:w-52 shrink-0"
    />
  )
}

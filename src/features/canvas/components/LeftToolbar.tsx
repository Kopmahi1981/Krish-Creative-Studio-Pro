import { useRef } from 'react'
import { MousePointer2, Type, Image as ImageIcon, Square, Hand } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { CanvasTool } from '../models/editor'
import { t, useLanguage } from '@/i18n'
import { processUploadedImageFile } from '../utils/imageUpload'
import { saveMediaRecord } from '../objects/mediaStorage'
import { useCanvasObjects } from '../objects/store'

interface LeftToolbarProps {
  active: CanvasTool
  onChange: (tool: CanvasTool) => void
}

const TOOLS: { id: CanvasTool; labelKey: string; Icon: typeof MousePointer2; disabled?: boolean }[] = [
  { id: 'select', labelKey: 'tool.select', Icon: MousePointer2 },
  { id: 'text', labelKey: 'tool.text', Icon: Type },
  { id: 'image', labelKey: 'tool.image', Icon: ImageIcon },
  { id: 'shape', labelKey: 'tool.shape', Icon: Square, disabled: true },
  { id: 'hand', labelKey: 'tool.hand', Icon: Hand },
]

/** Vertical tool rail. Supports text tool and image file upload. */
export function LeftToolbar({ active, onChange }: LeftToolbarProps) {
  useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await processUploadedImageFile(file)
      await saveMediaRecord({
        assetId: result.assetId,
        dataUrl: result.dataUrl,
        mimeType: result.mimeType,
        createdAt: new Date().toISOString(),
      })
      useCanvasObjects.getState().addImage({
        assetId: result.assetId,
        src: result.dataUrl,
        naturalWidth: result.naturalWidth,
        naturalHeight: result.naturalHeight,
        name: result.filename,
      })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload image.')
    } finally {
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5 border-r border-white/10 bg-surface/40 p-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        aria-hidden="true"
        onChange={handleFileChange}
      />
      {TOOLS.map(({ id, labelKey, Icon, disabled }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            data-tool={id}
            type="button"
            disabled={disabled}
            aria-label={t(labelKey)}
            aria-pressed={isActive}
            aria-disabled={disabled || undefined}
            title={t(labelKey)}
            onClick={() => {
              if (disabled) return
              if (id === 'image') {
                fileInputRef.current?.click()
                return
              }
              onChange(id)
            }}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-xl border transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60',
              disabled
                ? 'cursor-not-allowed border-transparent text-foreground-muted/40 opacity-50'
                : isActive
                  ? 'border-brand-purple/50 bg-brand-purple/15 text-brand-purple shadow-neon-purple'
                  : 'border-transparent text-foreground-secondary hover:bg-white/10 hover:text-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
          </button>
        )
      })}
    </div>
  )
}

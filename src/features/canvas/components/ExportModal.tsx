import { useState } from 'react'
import { Download, Loader2, Image as ImageIcon, Sparkles, Globe } from 'lucide-react'
import { Modal, Button } from '@/components/ui'
import { useCanvasObjects, selectActiveSize } from '../objects/store'
import {
  exportCanvasToImage,
  generateExportFilename,
  type ExportFormat,
  type ExportScale,
} from '../utils/exportCanvas'
import { LANGUAGES } from '@/i18n/types'
import { resolveFormat, getPlatform, getDesignType } from '@/features/platforms'

interface ExportModalProps {
  open: boolean
  onClose: () => void
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('png')
  const [scale, setScale] = useState<ExportScale>(2)
  const [isExporting, setIsExporting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const projectName = useCanvasObjects((s) => s.project.name)
  const activeDesignLang = useCanvasObjects((s) => s.activeDesignLanguage)
  const activeSize = useCanvasObjects(selectActiveSize)
  const setEditing = useCanvasObjects((s) => s.setEditing)
  const select = useCanvasObjects((s) => s.select)
  const pageBackground = useCanvasObjects((s) => s.project.documents[0]?.pages[0]?.background)

  const formatDef = resolveFormat(activeSize.id)
  const platform = getPlatform(formatDef.platformId)
  const designType = getDesignType(formatDef.designTypeId)
  const formatLabel = `${platform?.label ?? formatDef.platformId} ${designType?.label ?? formatDef.designTypeId}`

  const langObj = LANGUAGES.find((l) => l.code === activeDesignLang)
  const langName = langObj ? `${langObj.label} (${langObj.englishName})` : activeDesignLang

  const previewFilename = generateExportFilename(projectName, formatLabel, activeDesignLang, scale, format)
  const exportWidth = activeSize.width * scale
  const exportHeight = activeSize.height * scale

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setErrorMessage(null)

      // Exit active edit and selection chrome for a clean render
      setEditing(null)
      select(null)

      // Give React a frame to clear selection overlays if needed
      await new Promise((r) => setTimeout(r, 50))

      const artboardElement = document.querySelector('[data-canvas-artboard="true"]') as HTMLElement | null

      if (!artboardElement) {
        throw new Error('Canvas artboard element not found.')
      }

      await exportCanvasToImage({
        artboardElement,
        format,
        scale,
        projectName,
        formatLabel,
        designLanguage: activeDesignLang,
        backgroundColor: pageBackground,
      })

      onClose()
    } catch (err) {
      console.error('Export failed:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !isExporting && onClose()}
      title="Export Digital Creative"
      size="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Download {format.toUpperCase()}
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {errorMessage && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
            {errorMessage}
          </div>
        )}

        {/* Design Language & Format Badge */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-brand-purple" />
            <div>
              <p className="text-xs text-foreground-secondary">Active Content Variant</p>
              <p className="text-xs font-semibold text-foreground">{langName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-foreground-secondary">Artboard Format</p>
            <p className="text-xs font-semibold text-foreground">{formatLabel}</p>
          </div>
        </div>

        {/* Export Format Selection */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground-secondary">Image Format</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormat('png')}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                format === 'png'
                  ? 'border-brand-purple/60 bg-brand-purple/15 text-foreground'
                  : 'border-white/10 bg-white/5 text-foreground-secondary hover:bg-white/10 hover:text-foreground'
              }`}
            >
              <ImageIcon className="h-4 w-4 text-brand-purple" />
              <div>
                <p className="text-xs font-semibold">PNG</p>
                <p className="text-[11px] text-foreground-muted">Lossless / Sharp</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('jpeg')}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                format === 'jpeg'
                  ? 'border-brand-purple/60 bg-brand-purple/15 text-foreground'
                  : 'border-white/10 bg-white/5 text-foreground-secondary hover:bg-white/10 hover:text-foreground'
              }`}
            >
              <Sparkles className="h-4 w-4 text-brand-rose" />
              <div>
                <p className="text-xs font-semibold">JPEG</p>
                <p className="text-[11px] text-foreground-muted">High Quality / Compact</p>
              </div>
            </button>
          </div>
        </div>

        {/* Resolution Scale Selection */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground-secondary">Export Resolution</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setScale(1)}
              className={`rounded-xl border p-3 text-left transition ${
                scale === 1
                  ? 'border-brand-purple/60 bg-brand-purple/15 text-foreground'
                  : 'border-white/10 bg-white/5 text-foreground-secondary hover:bg-white/10 hover:text-foreground'
              }`}
            >
              <p className="text-xs font-semibold">1x Standard</p>
              <p className="text-[11px] text-foreground-muted">
                {activeSize.width} × {activeSize.height} px
              </p>
            </button>

            <button
              type="button"
              onClick={() => setScale(2)}
              className={`rounded-xl border p-3 text-left transition ${
                scale === 2
                  ? 'border-brand-purple/60 bg-brand-purple/15 text-foreground'
                  : 'border-white/10 bg-white/5 text-foreground-secondary hover:bg-white/10 hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">2x High-Res (Retina)</p>
                <span className="rounded bg-brand-purple/30 px-1.5 py-0.5 text-[10px] font-bold text-brand-cyan">
                  Rec
                </span>
              </div>
              <p className="text-[11px] text-foreground-muted">
                {exportWidth} × {exportHeight} px
              </p>
            </button>
          </div>
        </div>

        {/* Filename Preview Box */}
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-[11px] font-medium text-foreground-muted">Output Filename</p>
          <p className="mt-1 truncate font-mono text-xs font-medium text-brand-cyan">{previewFilename}</p>
        </div>
      </div>
    </Modal>
  )
}

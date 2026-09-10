import { toPng, toJpeg } from 'html-to-image'
import type { Language } from '@/i18n/types'
import { LANGUAGES } from '@/i18n/types'

export type ExportFormat = 'png' | 'jpeg'
export type ExportScale = 1 | 2

export interface ExportCanvasOptions {
  artboardElement: HTMLElement
  format: ExportFormat
  scale: ExportScale
  projectName: string
  formatLabel: string
  designLanguage: Language
  backgroundColor?: string
}

function sanitizeFilename(str: string): string {
  return str
    .trim()
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .replace(/\s+/g, '_')
}

export function generateExportFilename(
  projectName: string,
  formatLabel: string,
  designLanguage: Language,
  scale: ExportScale,
  format: ExportFormat,
): string {
  const cleanProject = sanitizeFilename(projectName) || 'Untitled_Project'
  const cleanFormat = sanitizeFilename(formatLabel) || 'Canvas'
  const langObj = LANGUAGES.find((l) => l.code === designLanguage)
  const langName = langObj ? langObj.englishName : designLanguage
  const ext = format === 'jpeg' ? 'jpg' : 'png'
  return `${cleanProject}_${cleanFormat}_${langName}_${scale}x.${ext}`
}

export async function exportCanvasToImage(options: ExportCanvasOptions): Promise<string> {
  const { artboardElement, format, scale, projectName, formatLabel, designLanguage, backgroundColor } = options

  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready
  }

  const filename = generateExportFilename(projectName, formatLabel, designLanguage, scale, format)

  const nodeOptions = {
    width: artboardElement.offsetWidth,
    height: artboardElement.offsetHeight,
    pixelRatio: scale,
    quality: 0.95,
    filter: (node: HTMLElement) => {
      if (node.hasAttribute && node.hasAttribute('data-export-ignore')) {
        return false
      }
      return true
    },
    style: {
      transform: 'none',
      margin: '0',
      backgroundImage: 'none',
      ...(backgroundColor ? { background: backgroundColor } : {}),
    },
  }

  let dataUrl: string
  if (format === 'jpeg') {
    dataUrl = await toJpeg(artboardElement, nodeOptions)
  } else {
    dataUrl = await toPng(artboardElement, nodeOptions)
  }

  // Trigger file download
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  return filename
}

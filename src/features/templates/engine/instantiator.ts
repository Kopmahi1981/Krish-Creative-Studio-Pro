/**
 * Pure Template Instantiator (Phase 5.7).
 *
 * Transforms a declarative template recipe into an independent, editable
 * CanvasProject with fresh UUIDs, pristine history, and isolated state.
 *
 * Preserves the source template without mutating it.
 */

import { resolveFormat } from '@/features/platforms'
import type { CanvasSizeId } from '@/features/canvas/models/editor'
import type {
  CanvasObject,
  CanvasProject,
  TextObject,
  ImageObject,
} from '@/features/canvas/objects/model'
import { DEFAULT_FONT_ID } from '@/features/canvas/fonts/config'
import type { Template } from '../types/template'
import type { TemplateElement } from './types'

let idCounter = 0
const nextId = (prefix: string) =>
  `${prefix}_tpl_${Date.now().toString(36)}_${(idCounter++).toString(36)}_${Math.random().toString(36).slice(2, 6)}`

/** Tone-based fallback background colors for dark mode neon aesthetic */
const TONE_BACKGROUNDS: Record<string, string> = {
  cyan: '#081524',
  purple: '#130924',
  rose: '#200914',
  slate: '#0b0f19',
}

/** Tone-based accent colors for text/CTAs */
const TONE_ACCENTS: Record<string, string> = {
  cyan: '#22d3ee',
  purple: '#c084fc',
  rose: '#fb7185',
  slate: '#94a3b8',
}

/** Map template platform + aspect ratio to a canonical FormatId */
function resolveTemplateFormatId(template: Template): CanvasSizeId {
  if (template.layout?.formatId) {
    return template.layout.formatId
  }

  const { platform, aspectRatio } = template

  if (platform === 'instagram') {
    if (aspectRatio === '9:16') return 'instagram.story'
    if (aspectRatio === '4:5') return 'instagram.portrait'
    return 'instagram.post'
  }

  if (platform === 'facebook') {
    if (aspectRatio === '9:16') return 'facebook.story'
    if (aspectRatio === '1.91:1') return 'facebook.ad'
    return 'facebook.post'
  }

  if (platform === 'linkedin') {
    return 'linkedin.post'
  }

  if (platform === 'pinterest') {
    return 'pinterest.pin'
  }

  if (platform === 'youtube') {
    return 'youtube.thumbnail'
  }

  if (aspectRatio === '9:16') return 'story'
  if (aspectRatio === '16:9') return 'landscape'
  return 'square'
}

/**
 * Generate sensible default layout elements for a template if none are explicitly declared.
 */
function generateFallbackElements(template: Template, width: number, height: number): TemplateElement[] {
  const accent = TONE_ACCENTS[template.tone] || '#c084fc'
  const isVertical = height > width
  const isLandscape = width > height

  const paddingX = Math.round(width * 0.08)
  const contentWidth = width - paddingX * 2

  const headlineFontSize = isVertical ? 56 : isLandscape ? 48 : 52
  const headlineHeight = Math.round(headlineFontSize * 2.2)
  const startY = Math.round(height * (isVertical ? 0.22 : 0.2))

  return [
    // Brand / Category Tag
    {
      kind: 'text',
      rect: {
        x: paddingX,
        y: startY - 50,
        width: contentWidth,
        height: 32,
      },
      name: 'Category Tag',
      textContent: template.category.toUpperCase(),
      style: {
        fontSize: 16,
        fontFamilyId: DEFAULT_FONT_ID,
        color: accent,
        align: 'left',
        letterSpacing: 2,
        fontWeight: 'bold',
      },
    },
    // Main Headline
    {
      kind: 'text',
      rect: {
        x: paddingX,
        y: startY,
        width: contentWidth,
        height: headlineHeight,
      },
      name: 'Main Headline',
      textContent: template.name,
      style: {
        fontSize: headlineFontSize,
        fontFamilyId: DEFAULT_FONT_ID,
        color: '#ffffff',
        align: 'left',
        lineHeight: 1.15,
        fontWeight: 'bold',
      },
    },
    // Subheadline / Description
    {
      kind: 'text',
      rect: {
        x: paddingX,
        y: startY + headlineHeight + 20,
        width: contentWidth,
        height: 70,
      },
      name: 'Subheadline',
      textContent: template.description,
      style: {
        fontSize: 22,
        fontFamilyId: DEFAULT_FONT_ID,
        color: '#94a3b8',
        align: 'left',
        lineHeight: 1.35,
      },
    },
    // Call to Action
    {
      kind: 'text',
      rect: {
        x: paddingX,
        y: startY + headlineHeight + 110,
        width: Math.min(260, contentWidth),
        height: 52,
      },
      name: 'Call to Action',
      textContent: template.funnel === 'bofu' ? 'SHOP NOW' : template.funnel === 'mofu' ? 'LEARN MORE' : 'DISCOVER',
      style: {
        fontSize: 18,
        fontFamilyId: DEFAULT_FONT_ID,
        color: '#090d16',
        align: 'center',
        fontWeight: 'bold',
        letterSpacing: 1,
      },
    },
  ]
}

export interface InstantiationResult {
  project: CanvasProject
  objectsById: Record<string, CanvasObject>
}

/** Get the background and elements for a template (either explicit layout or fallback) */
export function getTemplateLayout(template: Template): {
  formatId: CanvasSizeId
  width: number
  height: number
  background: string
  elements: TemplateElement[]
} {
  const formatId = resolveTemplateFormatId(template)
  const formatDef = resolveFormat(formatId)
  const { width, height } = formatDef
  const background = template.layout?.background || TONE_BACKGROUNDS[template.tone] || '#0f172a'
  const elements =
    template.layout?.elements && template.layout.elements.length > 0
      ? template.layout.elements
      : generateFallbackElements(template, width, height)

  return { formatId, width, height, background, elements }
}

export { resolveTemplateFormatId, TONE_BACKGROUNDS, TONE_ACCENTS }

/**
 * Instantiates a template into a standalone CanvasProject and normalized objects.
 * Everything is freshly created and deep-cloned so source templates are never mutated.
 */
export function instantiateTemplate(template: Template): InstantiationResult {
  const { formatId, width, height, background, elements: rawElements } = getTemplateLayout(template)
  const formatDef = resolveFormat(formatId)

  const projectId = nextId('project')
  const docId = nextId('doc')
  const pageId = nextId('page')
  const layerId = nextId('layer')

  const objectsById: Record<string, CanvasObject> = {}
  const objectIds: string[] = []

  rawElements.forEach((el, index) => {
    const objectId = nextId('obj')
    objectIds.push(objectId)

    if (el.kind === 'text') {
      const textObj: TextObject = {
        id: objectId,
        kind: 'text',
        rect: { ...el.rect },
        rotation: el.rotation ?? 0,
        opacity: el.opacity ?? 1,
        visible: true,
        locked: false,
        zIndex: index,
        name: el.name || 'Text',
        textContent: el.textContent,
        style: { ...el.style },
      }
      objectsById[objectId] = textObj
    } else if (el.kind === 'image') {
      const imgObj: ImageObject = {
        id: objectId,
        kind: 'image',
        rect: { ...el.rect },
        rotation: el.rotation ?? 0,
        opacity: el.opacity ?? 1,
        visible: true,
        locked: false,
        zIndex: index,
        name: el.name || 'Image',
        assetId: el.assetId,
        src: el.src,
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        alt: el.alt,
      }
      objectsById[objectId] = imgObj
    }
  })

  const project: CanvasProject = {
    id: projectId,
    name: template.name,
    activeDocumentId: docId,
    documents: [
      {
        id: docId,
        size: { id: formatDef.id, width, height },
        metadata: {
          title: template.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          revision: 1,
          sourceLanguage: 'en',
        },
        settings: {
          snapEnabled: false,
          gridVisible: false,
          unit: 'px',
        },
        activePageId: pageId,
        pages: [
          {
            id: pageId,
            name: 'Page 1',
            background,
            layers: [
              {
                id: layerId,
                name: 'Layer 1',
                visible: true,
                locked: false,
                objectIds,
              },
            ],
          },
        ],
      },
    ],
  }

  return { project, objectsById }
}

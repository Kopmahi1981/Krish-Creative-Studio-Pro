/**
 * Template Engine Schema & Types (Phase 5.7).
 *
 * Strongly-typed definitions for canvas layouts embedded in templates.
 * Decoupled from editor components to ensure templates remain pure,
 * serializable recipes that can be instantiated into independent documents.
 */

import type { CanvasSizeId } from '@/features/canvas/models/editor'
import type { TextStyle, CanvasRect } from '@/features/canvas/objects/model'

/** Text element layout in a template */
export interface TemplateTextElement {
  kind: 'text'
  rect: CanvasRect
  rotation?: number
  opacity?: number
  name?: string
  textContent: string
  style: TextStyle
}

/** Image element layout in a template (placeholder or pre-packaged) */
export interface TemplateImageElement {
  kind: 'image'
  rect: CanvasRect
  rotation?: number
  opacity?: number
  name?: string
  assetId: string
  src: string
  naturalWidth: number
  naturalHeight: number
  alt?: string
}

export type TemplateElement = TemplateTextElement | TemplateImageElement

/** Canvas layout payload embedded in a template definition */
export interface TemplateCanvasLayout {
  formatId: CanvasSizeId
  background: string
  elements: TemplateElement[]
}

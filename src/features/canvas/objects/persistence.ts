import { getCanvasSize } from '../models/sizes'
import type { CanvasObject, CanvasProject } from './model'

/** Browser storage key for the single locally editable canvas project. */
export const CANVAS_PERSISTENCE_KEY = 'kcs-canvas-project'
export const CANVAS_PERSISTENCE_VERSION = 1 as const

export interface PersistedCanvasProjectV1 {
  version: typeof CANVAS_PERSISTENCE_VERSION
  project: CanvasProject
  objectsById: Record<string, CanvasObject>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function isCanvasObject(value: unknown): value is CanvasObject {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.kind !== 'string') return false
  const rect = value.rect
  if (!isRecord(rect) || !['x', 'y', 'width', 'height'].every((key) => typeof rect[key] === 'number')) return false
  if (typeof value.rotation !== 'number' || typeof value.opacity !== 'number') return false
  if (typeof value.visible !== 'boolean' || typeof value.locked !== 'boolean' || typeof value.zIndex !== 'number') return false
  if (value.kind === 'text') {
    return typeof value.textContent === 'string' && isRecord(value.style)
  }
  return isRecord(value.props)
}

/**
 * Deliberately validates persisted structure before it is allowed into Zustand.
 * Saved data is treated as untrusted: malformed, obsolete, or manually edited
 * storage returns null so the caller can create a safe blank project instead.
 */
function isPersistedProject(value: unknown): value is PersistedCanvasProjectV1 {
  if (!isRecord(value) || value.version !== CANVAS_PERSISTENCE_VERSION) return false
  const project = value.project
  if (!isRecord(project) || typeof project.id !== 'string' || typeof project.name !== 'string') return false
  if (typeof project.activeDocumentId !== 'string' || !Array.isArray(project.documents)) return false
  if (!isRecord(value.objectsById) || !Object.values(value.objectsById).every(isCanvasObject)) return false

  const documents = project.documents
  if (documents.length === 0 || !documents.some((document) => isRecord(document) && document.id === project.activeDocumentId)) return false

  return documents.every((document) => {
    if (!isRecord(document) || typeof document.id !== 'string' || !isRecord(document.size)) return false
    if (typeof document.size.id !== 'string' || typeof document.size.width !== 'number' || typeof document.size.height !== 'number') return false
    if (!isRecord(document.metadata) || !isRecord(document.settings) || !Array.isArray(document.pages)) return false
    if (typeof document.activePageId !== 'string' || !document.pages.some((page) => isRecord(page) && page.id === document.activePageId)) return false
    return document.pages.every((page) =>
      isRecord(page) && typeof page.id === 'string' && typeof page.background === 'string' && Array.isArray(page.layers) &&
      page.layers.every((layer) => isRecord(layer) && Array.isArray(layer.objectIds) && layer.objectIds.every((id) => typeof id === 'string')),
    )
  })
}

/** Parse a saved project and normalize each retained format through the registry. */
export function loadPersistedCanvasProject(): PersistedCanvasProjectV1 | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CANVAS_PERSISTENCE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isPersistedProject(parsed)) return null

    return {
      ...parsed,
      project: {
        ...parsed.project,
        documents: parsed.project.documents.map((document) => {
          const size = getCanvasSize(document.size.id)
          return { ...document, size: { id: size.id, width: size.width, height: size.height } }
        }),
      },
    }
  } catch {
    return null
  }
}

export function savePersistedCanvasProject(snapshot: PersistedCanvasProjectV1): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CANVAS_PERSISTENCE_KEY, JSON.stringify(snapshot))
  } catch {
    // Storage can be unavailable or full. The in-memory editor remains usable.
  }
}

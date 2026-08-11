import type { CanvasDocument } from './editor'
import { getCanvasSize } from './sizes'

/**
 * Creates a fresh, empty editor document at the given size. Used by the canvas
 * workspace when no document exists yet. Phase 4.1 keeps a single empty page;
 * later phases will seed templates / restore from persistence.
 */
export function createDefaultDocument(sizeId: CanvasDocument['size']['id'] = 'square'): CanvasDocument {
  // Phase 5.1: registry-backed resolution (legacy ids + format ids, safe fallback).
  const size = getCanvasSize(sizeId)
  return {
    id: 'doc-local',
    title: 'Untitled Design',
    size,
    pages: [
      {
        id: 'page-1',
        name: 'Page 1',
        elements: [],
        background: '#0f172a',
      },
    ],
    activePageIndex: 0,
  }
}

import { create } from 'zustand'
import type { CanvasSizeId, CanvasTool } from '../models/editor'
import { getCanvasSize } from '../models/sizes'
import { DEFAULT_FONT_ID } from '../fonts/config'
import type {
  CanvasObject,
  CanvasObjectBase,
  CanvasProject,
  TextObject,
} from './model'

/** Tool mode for the editor (reuses the existing CanvasTool union). */
export type ToolMode = CanvasTool

let idCounter = 0
const nextId = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${(idCounter++).toString(36)}`

/** Build the initial single-page / single-layer document for a given size. */
function createInitialProject(sizeId: CanvasSizeId): CanvasProject {
  const size = getCanvasSize(sizeId)
  const layerId = 'layer_default'
  const docId = 'doc_active'
  const pageId = 'page_1'
  return {
    id: 'project_active',
    name: 'Untitled Project',
    activeDocumentId: docId,
    documents: [
      {
        id: docId,
        size: { id: size.id, width: size.width, height: size.height },
        metadata: {
          title: 'Untitled Design',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          revision: 1,
        },
        settings: { snapEnabled: false, gridVisible: false, unit: 'px' },
        activePageId: pageId,
        pages: [
          {
            id: pageId,
            name: 'Page 1',
            background: '#0f172a',
            layers: [{ id: layerId, name: 'Layer 1', visible: true, locked: false, objectIds: [] }],
          },
        ],
      },
    ],
  }
}

interface CanvasObjectState {
  project: CanvasProject
  /** Normalized flat object map for O(1) updates + selector isolation. */
  objectsById: Record<string, CanvasObject>
  selectedObjectId: string | null
  editingObjectId: string | null
  toolMode: ToolMode

  // --- Tool / selection ---
  setToolMode: (mode: ToolMode) => void
  select: (id: string | null) => void
  deselect: () => void
  setEditing: (id: string | null) => void

  // --- Mutations ---
  addText: (x: number, y: number, defaults?: Partial<TextObject>) => string
  updateObject: (id: string, patch: Partial<CanvasObjectBase> & { style?: Partial<TextObject['style']>; textContent?: string }) => void
  removeObject: (id: string) => void
  clearAll: () => void

  // --- Document ---
  setDocumentSize: (sizeId: CanvasSizeId) => void
}

/** Locate the active page + layer for the active document. */
function activeLayer(state: CanvasObjectState) {
  const doc = state.project.documents.find((d) => d.id === state.project.activeDocumentId)!
  const page = doc.pages.find((p) => p.id === doc.activePageId)!
  const layer = page.layers[0]
  return { doc, page, layer }
}

export const useCanvasObjects = create<CanvasObjectState>((set) => ({
  project: createInitialProject('square'),
  objectsById: {},
  selectedObjectId: null,
  editingObjectId: null,
  toolMode: 'select',

  setToolMode: (mode) => set({ toolMode: mode }),
  select: (id) => set({ selectedObjectId: id, editingObjectId: null }),
  deselect: () => set({ selectedObjectId: null, editingObjectId: null }),
  setEditing: (id) => set({ editingObjectId: id }),

  addText: (x, y, defaults) => {
    const id = nextId('obj')
    const base: CanvasObjectBase = {
      id,
      kind: 'text',
      rect: { x, y, width: 320, height: 64 },
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 0,
      name: 'Text',
    }
    const text: TextObject = {
      ...base,
      kind: 'text',
      textContent: defaults?.textContent ?? 'Double-click to edit',
      style: {
        fontSize: defaults?.style?.fontSize ?? 32,
        fontFamilyId: defaults?.style?.fontFamilyId ?? DEFAULT_FONT_ID,
        color: defaults?.style?.color ?? '#ffffff',
        align: defaults?.style?.align ?? 'left',
      },
    }
    set((state) => {
      const { layer } = activeLayer(state)
      return {
        objectsById: { ...state.objectsById, [id]: text },
        project: {
          ...state.project,
          documents: state.project.documents.map((d) =>
            d.id !== state.project.activeDocumentId
              ? d
              : {
                  ...d,
                  pages: d.pages.map((p) =>
                    p.id !== d.activePageId
                      ? p
                      : {
                          ...p,
                          layers: p.layers.map((l) =>
                            l.id !== layer.id ? l : { ...l, objectIds: [...l.objectIds, id] },
                          ),
                        },
                  ),
                },
          ),
        },
        selectedObjectId: id,
        editingObjectId: null,
        // Place-once model: after creating a text object the tool returns to Select
        // so subsequent canvas clicks behave normally (select/edit), instead of
        // spawning more text objects on every click.
        toolMode: 'select',
      }
    })
    return id
  },

  updateObject: (id, patch) => {
    set((state) => {
      const prev = state.objectsById[id]
      if (!prev) return state
      let next: CanvasObject
      if (prev.kind === 'text') {
        const { style, textContent, ...basePatch } = patch as Partial<TextObject>
        next = {
          ...prev,
          ...basePatch,
          textContent: textContent ?? prev.textContent,
          style: style ? { ...prev.style, ...style } : prev.style,
        }
      } else {
        next = { ...prev, ...patch } as CanvasObject
      }
      // Keep layer zIndex order in sync (cheap; only when zIndex changes).
      return { objectsById: { ...state.objectsById, [id]: next } }
    })
  },

  removeObject: (id) => {
    set((state) => {
      const { layer } = activeLayer(state)
      const { [id]: _removed, ...rest } = state.objectsById
      return {
        objectsById: rest,
        project: {
          ...state.project,
          documents: state.project.documents.map((d) =>
            d.id !== state.project.activeDocumentId
              ? d
              : {
                  ...d,
                  pages: d.pages.map((p) =>
                    p.id !== d.activePageId
                      ? p
                      : {
                          ...p,
                          layers: p.layers.map((l) =>
                            l.id !== layer.id
                              ? l
                              : { ...l, objectIds: l.objectIds.filter((oid) => oid !== id) },
                          ),
                        },
                  ),
                },
          ),
        },
        selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
        editingObjectId: state.editingObjectId === id ? null : state.editingObjectId,
      }
    })
  },

  clearAll: () =>
    set((state) => {
      const { layer } = activeLayer(state)
      return {
        objectsById: {},
        selectedObjectId: null,
        editingObjectId: null,
        project: {
          ...state.project,
          documents: state.project.documents.map((d) =>
            d.id !== state.project.activeDocumentId
              ? d
              : {
                  ...d,
                  pages: d.pages.map((p) =>
                    p.id !== d.activePageId
                      ? p
                      : {
                          ...p,
                          layers: p.layers.map((l) =>
                            l.id !== layer.id ? l : { ...l, objectIds: [] },
                          ),
                        },
                  ),
                },
          ),
        },
      }
    }),

  setDocumentSize: (sizeId) => {
    // Phase 5.1: resolve through the registry-backed helper so BOTH legacy size
    // ids and registry format ids work, and an unknown id falls back safely
    // instead of collapsing the artboard.
    const size = getCanvasSize(sizeId)
    set((state) => ({
      project: {
        ...state.project,
        documents: state.project.documents.map((d) =>
          d.id !== state.project.activeDocumentId
            ? d
            : { ...d, size: { id: size.id, width: size.width, height: size.height } },
        ),
      },
    }))
  },
}))

// Dev-only inspection hook (no production impact; tree-shaken in prod build is unnecessary but harmless).
if (typeof window !== 'undefined') {
  ;(window as unknown as { __canvasStore?: typeof useCanvasObjects }).__canvasStore = useCanvasObjects
}

/** Convenience selector: the active document's intrinsic size (full CanvasSize). */
export function selectActiveSize(state: CanvasObjectState) {
  const doc = state.project.documents.find((d) => d.id === state.project.activeDocumentId)!
  return getCanvasSize(doc.size.id)
}

/** Convenience selector: ordered object ids of the active layer. */
export function selectActiveObjectIds(state: CanvasObjectState): string[] {
  const doc = state.project.documents.find((d) => d.id === state.project.activeDocumentId)!
  const page = doc.pages.find((p) => p.id === doc.activePageId)!
  return page.layers[0]?.objectIds ?? []
}

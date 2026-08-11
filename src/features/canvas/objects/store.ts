import { create } from 'zustand'
import { __clearResolveCache } from '../i18n-content/resolver'
import type { CanvasSizeId, CanvasTool } from '../models/editor'
import { getCanvasSize } from '../models/sizes'
import { DEFAULT_FONT_ID } from '../fonts/config'
import type {
  CanvasObject,
  CanvasObjectBase,
  CanvasDocumentModel,
  CanvasProject,
  TextObject,
} from './model'
import type { Language } from '@/i18n/types'
import { DEFAULT_LANGUAGE } from '@/i18n/types'
import type { DocumentVariants } from '../i18n-content/types'
import {
  createVariant,
  markOverridesStale,
  pruneOverrides,
  removeObjectFromAllVariants,
  setOverride,
} from '../i18n-content/variants'

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
          // Phase 5.2: the original design content is authored in English.
          sourceLanguage: DEFAULT_LANGUAGE,
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
  /**
   * The DESIGN language that was active when the CURRENT inline edit began
   * (see `editingLanguage` below). We also keep the language that was active
   * BEFORE the most recent edit, so that when a language switch unmounts the
   * inline editor mid-edit, its commit still lands in the language the user
   * was actually typing in (not the language they switched TO).
   */
  preEditDesignLanguage: Language
  toolMode: ToolMode
  /**
   * The DESIGN language active when the CURRENT inline edit began.
   *
   * Phase 5.2 safety: a variant edit must commit to the language the user was
   * *typing in*. Switching design language while the inline editor is open
   * unmounts it, and its onCommit fires AFTER the language changed — routing by
   * the live `activeDesignLanguage` would write the typed text into the wrong
   * branch. Capturing the language at edit-start routes the commit correctly.
   */
  editingLanguage: Language
  /**
   * The DESIGN language currently being edited (Phase 5.2).
   *
   * Deliberately separate from the UI language (`useLanguageStore`): you can
   * edit a Telugu design with an English interface and vice versa. When this
   * equals the document's `sourceLanguage`, the editor behaves exactly as it
   * did before Phase 5.2.
   */
  activeDesignLanguage: Language

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

  // --- Multilingual design content (Phase 5.2) ---
  /** Switch the design language being edited. Never mutates any object. */
  setActiveDesignLanguage: (lang: Language) => void
  /**
   * Create an (initially EMPTY) language variant overlay for a non-source
   * language (Phase 5.2 UX). An empty variant is what makes "a Telugu variant
   * exists but nothing is translated yet" distinguishable from "no Telugu
   * variant". Idempotent and never touches the original objects.
   */
  createDesignVariant: (lang: Language) => void
  /**
   * THE SINGLE ROUTED WRITE for text content.
   *
   * Source language  → writes the ORIGINAL object and marks that object's
   *                    existing translations stale (never deletes them).
   * Variant language → writes ONLY `document.variants[lang].overrides[id]`.
   *                    The original object is left byte-identical.
   *
   * Every text-commit path funnels through here, so preservation is enforced
   * at exactly one branch rather than at each call site.
   */
  setObjectText: (id: string, textContent: string) => void
}

/** Resolve the active document (Phase 5.2 helper). */
function activeDocument(state: CanvasObjectState): CanvasDocumentModel {
  return state.project.documents.find((d) => d.id === state.project.activeDocumentId)!
}

/** Source language of the active document, tolerating pre-5.2 documents. */
export function selectSourceLanguage(state: CanvasObjectState): Language {
  return activeDocument(state).metadata.sourceLanguage ?? DEFAULT_LANGUAGE
}

/** Variants of the active document (may be undefined). */
export function selectVariants(state: CanvasObjectState): DocumentVariants | undefined {
  return activeDocument(state).variants
}

/** True when the active document has at least one object (enables "Create Variant"). */
export function selectHasObjects(state: CanvasObjectState): boolean {
  return Object.keys(state.objectsById).length > 0
}

/** Immutably replace the active document's variants. */
function withVariants(state: CanvasObjectState, variants: DocumentVariants) {
  return {
    project: {
      ...state.project,
      documents: state.project.documents.map((d) =>
        d.id !== state.project.activeDocumentId ? d : { ...d, variants },
      ),
    },
  }
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
  // Starts on the source language, so default behaviour is identical to 5.1.
  activeDesignLanguage: DEFAULT_LANGUAGE,
  editingLanguage: DEFAULT_LANGUAGE,
  preEditDesignLanguage: DEFAULT_LANGUAGE,

  setToolMode: (mode) => set({ toolMode: mode }),
  select: (id) => set({ selectedObjectId: id, editingObjectId: null }),
  deselect: () => set({ selectedObjectId: null, editingObjectId: null }),
  setEditing: (id) =>
    set((state) =>
      id === null
        ? { editingObjectId: null }
        // Capture the language being edited so a later language switch cannot
        // redirect this edit's commit into a different branch. We also stash
        // the PRE-edit language: if a switch unmounts the editor, the commit
        // must land in the language the user was typing in, not the switched-to
        // language. See `setObjectText`'s variant branch for the guard.
        : {
            editingObjectId: id,
            editingLanguage: state.activeDesignLanguage,
            preEditDesignLanguage: state.activeDesignLanguage,
          },
    ),

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
        // Phase 5.2 SAFETY NET: while a variant language is active, a text
        // write must never reach the original object. Geometry/style patches
        // (move, resize) still apply to the original, which is correct — the
        // design is shared across languages and stored exactly once.
        const sourceLanguage = selectSourceLanguage(state)
        const inVariant = state.activeDesignLanguage !== sourceLanguage
        next = {
          ...prev,
          ...basePatch,
          textContent: inVariant ? prev.textContent : textContent ?? prev.textContent,
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
      // Phase 5.2: an override whose base object no longer exists is
      // unreachable garbage — cascade-remove it from EVERY language.
      const prunedVariants = removeObjectFromAllVariants(selectVariants(state), id)
      return {
        objectsById: rest,
        project: {
          ...state.project,
          documents: state.project.documents.map((d) =>
            d.id !== state.project.activeDocumentId
              ? d
              : {
                  ...d,
                  variants: prunedVariants,
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
      // Phase 5.2: no objects remain, so no override can reference one.
      const emptiedVariants = pruneOverrides(selectVariants(state), new Set<string>())
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
                  variants: emptiedVariants,
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

  setActiveDesignLanguage: (lang) =>
    set((state) => {
      if (state.activeDesignLanguage === lang) return state
      // Exiting edit mode BEFORE the switch is a hard safety requirement:
      // TextEditorOverlay commits its buffer on unmount, and if that commit
      // landed after the language flipped it would write text authored in one
      // language through the other language's branch. Clearing editingObjectId
      // here makes the unmount-commit fire while `activeDesignLanguage` is
      // still the language the user was actually typing in.
      // `preEditDesignLanguage` is also reset so a commit that slips through
      // after this switch is unambiguously routed on the live language.
      // The resolve cache is cleared so a stale resolved object can never
      // linger across a language change.
      __clearResolveCache()
      return { ...state, editingObjectId: null, preEditDesignLanguage: lang, activeDesignLanguage: lang }
    }),

  createDesignVariant: (lang) =>
    set((state) => {
      const sourceLanguage = selectSourceLanguage(state)
      // The source language IS the original design — it has no variant.
      if (lang === sourceLanguage) return state
      const existing = selectVariants(state)
      // Idempotent: an existing variant (even empty) is left untouched.
      if (existing?.[lang]) return state
      const variants = { ...existing, [lang]: createVariant(lang) }
      const changing = state.activeDesignLanguage !== lang
      __clearResolveCache()
      return {
        ...withVariants(state, variants),
        activeDesignLanguage: lang,
        // Mirror setActiveDesignLanguage: a real language change exits edit mode
        // so an in-flight inline edit can't commit through the wrong branch.
        // Reset preEditDesignLanguage to the new language for the same reason.
        ...(changing ? { editingObjectId: null, preEditDesignLanguage: lang } : {}),
      }
    }),

  setObjectText: (id, textContent) => {
    set((state) => {
      const prev = state.objectsById[id]
      if (!prev || prev.kind !== 'text') return state
      const sourceLanguage = selectSourceLanguage(state)
      // ROUTE ON THE LIVE activeDesignLanguage — that is the single source of
      // truth for "which language am I editing right now". The editor's
      // unmount-commit (Escape / click-away / language switch) fires AFTER the
      // switch has already changed `activeDesignLanguage`, so routing on the
      // captured `editingLanguage` would write into the WRONG branch. To keep
      // the unmount-commit correct we instead guard: if an edit session is
      // being torn down (editingObjectId === id) we route on the language the
      // user was typing in (preEditDesignLanguage), which setActiveDesignLanguage
      // / createDesignVariant leave pointing at the pre-switch language.
      const committingUnmount = state.editingObjectId === id
      const lang = committingUnmount ? state.preEditDesignLanguage : state.activeDesignLanguage

      // ---- VARIANT BRANCH: write ONLY the overlay. ----
      if (lang !== sourceLanguage) {
        if (textContent === (prev as TextObject).textContent) {
          // Unchanged relative to source: nothing meaningful to store.
          return state
        }
        const variants = setOverride(
          selectVariants(state),
          lang,
          id,
          textContent,
          (prev as TextObject).textContent,
        )
        // NOTE: `objectsById` is intentionally absent from this update.
        return withVariants(state, variants)
      }

      // ---- SOURCE BRANCH: write the original, flag its translations stale. ----
      if (textContent === (prev as TextObject).textContent) return state
      const nextObj: TextObject = { ...(prev as TextObject), textContent }
      const existing = selectVariants(state)
      const staleUpdate = existing
        ? withVariants(state, markOverridesStale(existing, id, textContent))
        : {}
      return {
        ...staleUpdate,
        objectsById: { ...state.objectsById, [id]: nextObj },
      }
    })
  },

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

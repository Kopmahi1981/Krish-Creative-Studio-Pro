import { type CSSProperties, type RefObject } from 'react'
import type { CanvasDocument, CanvasSize } from '../models/editor'
import { buildSafeAreaGuides, buildCenterGuides, SAFE_AREA_INSET_RATIO } from '../models/sizes'

interface CanvasWorkspaceProps {
  document: CanvasDocument
  scale: number
  showGrid: boolean
  /** Ref to the scrollable workspace element (owned by the viewport hook). */
  containerRef: RefObject<HTMLDivElement | null>
}

/**
 * Center canvas workspace — the only scrollable region of the editor.
 *
 * Centering uses a `margin:auto` content wrapper: this both centers the artboard
 * when it fits AND allows symmetric scrolling to reveal overflow when the user
 * zooms past the fit scale (no clipping, scrollbar appears only here, only when
 * needed). Safe-area margin guides and center cross guides are drawn on top.
 */
export function CanvasWorkspace({ document, scale, showGrid, containerRef }: CanvasWorkspaceProps) {
  const page = document.pages[document.activePageIndex] ?? document.pages[0]
  const size: CanvasSize = document.size
  const boardW = size.width * scale
  const boardH = size.height * scale
  const safeGuides = buildSafeAreaGuides(size.width, size.height)
  const centerGuides = buildCenterGuides(size.width, size.height)

  const boardStyle: CSSProperties = {
    width: boardW,
    height: boardH,
    background: page.background,
    backgroundImage: showGrid
      ? `linear-gradient(to right, rgba(148,163,184,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.16) 1px, transparent 1px)`
      : undefined,
    backgroundSize: showGrid ? `${40 * scale}px ${40 * scale}px` : undefined,
  }

  return (
    <div ref={containerRef} className="relative flex-1 overflow-auto bg-background">
      {/* Ambient radial glow behind the artboard (theme-aware via CSS vars) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(40rem 40rem at 30% 0%, rgba(168,85,247,0.10), transparent 60%), radial-gradient(36rem 36rem at 90% 100%, rgba(34,211,238,0.08), transparent 55%)',
        }}
      />

      {/* margin:auto centers the artboard and enables symmetric overflow scroll */}
      <div className="flex min-h-full min-w-full items-center justify-center p-6">
        <div className="relative" style={{ margin: 'auto' }}>
          <div
            className="relative shadow-glass ring-1 ring-white/10"
            style={boardStyle}
            role="img"
            aria-label={`${size.width} by ${size.height} artboard at ${Math.round(scale * 100)}%`}
          >
            {/* Center cross guides (rule) */}
            {centerGuides.map((g) => (
              <div
                key={g.id}
                className="pointer-events-none absolute bg-white/25"
                style={
                  g.orientation === 'vertical'
                    ? { left: g.position * scale, top: 0, width: 1, height: boardH }
                    : { top: g.position * scale, left: 0, height: 1, width: boardW }
                }
              />
            ))}

            {/* Safe-area margin guides (dashed rectangle + edge ticks) */}
            <div
              className="pointer-events-none absolute border border-dashed border-white/40"
              style={{
                left: size.width * SAFE_AREA_INSET_RATIO * scale,
                top: size.height * SAFE_AREA_INSET_RATIO * scale,
                width: size.width * (1 - SAFE_AREA_INSET_RATIO * 2) * scale,
                height: size.height * (1 - SAFE_AREA_INSET_RATIO * 2) * scale,
              }}
            />
            {safeGuides.map((g) => (
              <div
                key={g.id}
                className="pointer-events-none absolute bg-white/30"
                style={
                  g.orientation === 'vertical'
                    ? { left: g.position * scale, top: 0, width: 1, height: boardH }
                    : { top: g.position * scale, left: 0, height: 1, width: boardW }
                }
              />
            ))}

            {/* Empty-state hint (Phase 4.1 — no elements yet) */}
            {page.elements.length === 0 && (
              <div className="absolute inset-0 grid place-items-center px-6 text-center">
                <p className="max-w-xs text-sm font-medium text-white/70">
                  Your canvas is empty. Elements, text, and images arrive in the next phase.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

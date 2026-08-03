import { MousePointerClick, SlidersHorizontal } from 'lucide-react'

/**
 * Right-hand properties panel. Phase 4.1 renders a clearly-labelled placeholder;
 * the live property editors (position, size, typography, fill, alignment) arrive
 * in Phase 4.2 once elements can be selected.
 */
export function RightPropertiesPanel() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-l border-white/10 bg-surface/40 lg:flex">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <SlidersHorizontal className="h-4 w-4 text-brand-purple" />
        <h2 className="text-sm font-semibold text-foreground">Properties</h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-foreground-muted">
          <MousePointerClick className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Nothing selected</p>
          <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-foreground-muted">
            Select an object on the canvas to reveal its properties here.
          </p>
        </div>

        <ul className="max-w-[15rem] space-y-1.5 text-left text-xs text-foreground-muted">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-purple" />
            Position &amp; size (X, Y, W, H)
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-rose" />
            Typography, color &amp; opacity
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-cyan" />
            Alignment, layering &amp; effects
          </li>
        </ul>

        <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] leading-relaxed text-foreground-muted">
          Live property editing becomes available in the next phase.
        </p>
      </div>
    </aside>
  )
}

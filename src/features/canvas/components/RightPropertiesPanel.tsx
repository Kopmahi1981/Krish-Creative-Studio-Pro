import { SlidersHorizontal, MousePointerClick } from 'lucide-react'
import { Input, Select, Slider, ColorPicker } from '@/components/ui'
import { useCanvasObjects } from '../objects/store'
import { FONT_CONFIG } from '../fonts/config'
import type { TextObject } from '../objects/model'

const fontOptions = FONT_CONFIG.map((f) => ({ label: f.label, value: f.id }))

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-foreground-muted">{label}</span>
      {children}
    </label>
  )
}

function NumberInput({
  value,
  onChange,
  step = 1,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
}) {
  return (
    <Input
      type="number"
      value={String(Math.round(value))}
      step={step}
      onChange={(e) => {
        const n = Number(e.target.value)
        if (!Number.isNaN(n)) onChange(n)
      }}
      className="w-full"
    />
  )
}

/**
 * Right-hand properties panel.
 * Shows a placeholder when nothing is selected, and LIVE controls bound to the
 * selected text object (X, Y, W, H, Rotation, Font Size, Font Family, Color,
 * Opacity). Edits write straight to the centralized store.
 */
export function RightPropertiesPanel() {
  const selectedId = useCanvasObjects((s) => s.selectedObjectId)
  const object = useCanvasObjects((s) => (selectedId ? s.objectsById[selectedId] : null))
  const update = useCanvasObjects((s) => s.updateObject)

  const header = (
    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
      <SlidersHorizontal className="h-4 w-4 text-brand-purple" />
      <h2 className="text-sm font-semibold text-foreground">Properties</h2>
    </div>
  )

  if (!object || object.kind !== 'text') {
    return (
      <aside className="hidden w-72 shrink-0 flex-col border-l border-white/10 bg-surface/40 lg:flex">
        {header}
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
        </div>
      </aside>
    )
  }

  const obj = object as TextObject
  const setStyle = (patch: Partial<TextObject['style']>) => update(obj.id, { style: patch })
  const setRect = (patch: Partial<TextObject['rect']>) =>
    update(obj.id, { rect: { ...obj.rect, ...patch } })

  return (
    <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-surface/40 lg:flex">
      {header}
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="X">
            <NumberInput value={obj.rect.x} onChange={(v) => setRect({ x: v })} />
          </Field>
          <Field label="Y">
            <NumberInput value={obj.rect.y} onChange={(v) => setRect({ y: v })} />
          </Field>
          <Field label="Width">
            <NumberInput value={obj.rect.width} onChange={(v) => setRect({ width: Math.max(24, v) })} />
          </Field>
          <Field label="Height">
            <NumberInput value={obj.rect.height} onChange={(v) => setRect({ height: Math.max(24, v) })} />
          </Field>
        </div>

        <Field label="Rotation">
          <Slider
            min={-180}
            max={180}
            value={obj.rotation}
            onChange={(v) => update(obj.id, { rotation: v })}
          />
        </Field>

        <Field label="Font Size">
          <NumberInput value={obj.style.fontSize} onChange={(v) => setStyle({ fontSize: Math.max(1, v) })} />
        </Field>

        <Field label="Font Family">
          <Select
            value={obj.style.fontFamilyId}
            options={fontOptions}
            onChange={(e) => setStyle({ fontFamilyId: e.target.value })}
          />
        </Field>

        <Field label="Align">
          <Select
            value={obj.style.align}
            options={[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ]}
            onChange={(e) => setStyle({ align: e.target.value as TextObject['style']['align'] })}
          />
        </Field>

        <Field label="Color">
          <ColorPicker value={obj.style.color} onChange={(v) => setStyle({ color: v })} />
        </Field>

        <Field label={`Opacity (${Math.round(obj.opacity * 100)}%)`}>
          <Slider
            min={0}
            max={100}
            value={Math.round(obj.opacity * 100)}
            onChange={(v) => update(obj.id, { opacity: v / 100 })}
          />
        </Field>
      </div>
    </aside>
  )
}

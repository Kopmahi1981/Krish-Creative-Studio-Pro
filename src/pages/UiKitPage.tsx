import { useState } from 'react'
import {
  Plus,
  Trash2,
  MoreVertical,
  Settings,
  Download,
  Pencil,
  Image as ImageIcon,
  Edit3,
} from 'lucide-react'
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  ColorPicker,
  Slider,
  Switch,
  Badge,
  Chip,
  Tooltip,
  Modal,
  Drawer,
  Tabs,
  Accordion,
  Dropdown,
  Popover,
  ContextMenu,
  Card,
  GlassCard,
  SectionHeader,
  PageHeader,
  LoadingSpinner,
  EmptyState,
} from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
// NOTE: `Toast` component export removed from showcase; ToastProvider is mounted in App.tsx.
import { NAV_ITEMS } from '@/features/navigation/navItems'

/**
 * Phase 1 developer showcase for the reusable UI primitive library.
 * This is a DEV/QA route only (navigable via /ui-kit) and contains no business logic.
 */
export function UiKitPage() {
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [switchOn, setSwitchOn] = useState(true)
  const [sliderVal, setSliderVal] = useState(42)
  const [color, setColor] = useState('#a855f7')
  const [chips, setChips] = useState(['Facebook', 'Instagram', 'LinkedIn'])

  return (
    <div className="space-y-10">
      <PageHeader
        title="UI Kit"
        description="Reusable Phase 1 primitives built on the glassmorphism + neon-glow design system."
        actions={
          <Button
            onClick={() => toast('Button clicked — toast works!', 'success')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Trigger Toast
          </Button>
        }
      />

      <section>
        <SectionHeader title="Buttons & Icons" />
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <IconButton label="Edit" tone="cyan"><Pencil className="h-4 w-4" /></IconButton>
          <IconButton label="Delete" tone="rose"><Trash2 className="h-4 w-4" /></IconButton>
          <IconButton label="Settings"><Settings className="h-4 w-4" /></IconButton>
        </div>
      </section>

      <section>
        <SectionHeader title="Inputs" />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Project name" placeholder="Summer Sale Campaign" />
          <Select label="Platform" options={NAV_ITEMS.map((n) => ({ label: n.label, value: n.id }))} />
          <Textarea label="Notes" placeholder="Add creative brief details…" />
          <div className="space-y-5 pt-1">
            <Slider label="Opacity" value={sliderVal} onChange={setSliderVal} />
            <ColorPicker label="Accent" value={color} onChange={setColor} />
            <Switch checked={switchOn} onChange={setSwitchOn} label="Enable auto-export" />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Badges, Chips & Feedback" />
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="rose">Rose</Badge>
            <Badge tone="purple">Purple</Badge>
            <Badge tone="cyan">Cyan</Badge>
            <Badge tone="success">Live</Badge>
            <Badge tone="slate">Draft</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip key={c} onRemove={() => setChips((p) => p.filter((x) => x !== c))} active>
                {c}
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Tooltip content="Helpful hint on top">
              <Button variant="outline">Hover me</Button>
            </Tooltip>
            <LoadingSpinner label="Loading…" />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Surfaces" />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="font-semibold text-foreground">Card</p>
            <p className="mt-1 text-sm text-foreground-muted">Solid surface for content blocks.</p>
          </Card>
          <GlassCard accent="cyan">
            <p className="font-semibold text-foreground">GlassCard</p>
            <p className="mt-1 text-sm text-foreground-muted">Glassmorphism surface with neon accent.</p>
          </GlassCard>
          <div className="md:col-span-2">
            <EmptyState icon={ImageIcon} title="No assets yet" description="Upload images to build your media library." />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Overlays" />
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
          <Dropdown
            trigger={
              <Button variant="outline">
                <MoreVertical className="h-4 w-4" /> Menu
              </Button>
            }
            options={[
              { label: 'Edit', value: 'edit', icon: <Edit3 className="h-4 w-4" /> },
              { label: 'Download', value: 'dl', icon: <Download className="h-4 w-4" /> },
              { label: 'Delete', value: 'del', icon: <Trash2 className="h-4 w-4" /> },
            ]}
            onSelect={(v) => toast(`Selected: ${v}`, 'info')}
          />
          <Popover
            trigger={<Button variant="outline">Popover</Button>}
          >
            <p className="text-sm text-foreground-secondary">Rich popover content goes here.</p>
          </Popover>
          <ContextMenu
            items={[
              { label: 'Rename', icon: <Edit3 className="h-4 w-4" />, onClick: () => toast('Rename', 'info') },
              { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, danger: true, onClick: () => toast('Deleted', 'error') },
            ]}
          >
            <div className="grid h-20 w-48 place-items-center rounded-xl border border-dashed border-white/15 text-sm text-foreground-muted">
              Right-click me
            </div>
          </ContextMenu>
        </div>
      </section>

      <section>
        <SectionHeader title="Tabs & Accordion" />
        <Tabs
          tabs={[
            { id: 'a', label: 'Templates', content: <p className="text-sm text-foreground-secondary">Template library placeholder.</p> },
            { id: 'b', label: 'Brand', content: <p className="text-sm text-foreground-secondary">Brand kit placeholder.</p> },
            { id: 'c', label: 'Export', content: <p className="text-sm text-foreground-secondary">Export center placeholder.</p> },
          ]}
        />
        <div className="mt-4">
          <Accordion
            items={[
              { id: '1', title: 'Keyboard shortcuts', content: '⌘K to search, ⌘B to toggle sidebar.' },
              { id: '2', title: 'Theme', content: 'Dark mode is the default; toggle from the top bar.' },
            ]}
          />
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p className="text-sm text-foreground-secondary">This modal demonstrates the glass overlay + focus trap pattern.</p>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Example Drawer">
        <p className="text-sm text-foreground-secondary">Slide-out panel content lives here.</p>
      </Drawer>
    </div>
  )
}

import { create } from 'zustand'

interface UiState {
  /** Command palette (⌘K) visibility. */
  commandPaletteOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void
  toggleCommandPalette: () => void
}

/**
 * Lightweight global UI state for cross-component surface control.
 * Currently drives the Command Palette, which can be triggered from the TopBar
 * search and the ⌘K / Ctrl+K keyboard shortcut.
 */
export const useUiStore = create<UiState>((set) => ({
  commandPaletteOpen: false,
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
}))

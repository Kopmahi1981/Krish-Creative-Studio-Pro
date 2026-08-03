import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TemplateLibraryState {
  /** Favorite template ids (client-only, persisted to localStorage). */
  favorites: string[]
  /** Recently opened template ids, most-recent first (client-only). */
  recents: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  pushRecent: (id: string) => void
  clearRecents: () => void
}

const MAX_RECENTS = 8

/**
 * Local-only favorites + recents store for the template engine.
 * Persisted via zustand/middleware so state survives refreshes — no backend,
 * no authentication, no business logic.
 */
export const useTemplateLibraryStore = create<TemplateLibraryState>()(
  persist(
    (set, get) => ({
      favorites: [],
      recents: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
      pushRecent: (id) =>
        set((state) => ({
          recents: [id, ...state.recents.filter((r) => r !== id)].slice(0, MAX_RECENTS),
        })),
      clearRecents: () => set({ recents: [] }),
    }),
    { name: 'kcs-template-library' },
  ),
)

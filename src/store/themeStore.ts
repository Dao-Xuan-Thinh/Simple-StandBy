import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme } from '../types/widget'
import { PRESET_THEMES } from '../themes'

interface ThemeState {
  activeThemeId: string
  customCSS: string
  customThemes: Theme[]
  setTheme: (id: string) => void
  setCustomCSS: (css: string) => void
  addCustomTheme: (theme: Theme) => void
  removeCustomTheme: (id: string) => void
  allThemes: () => Theme[]
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      activeThemeId: 'amoled',
      customCSS: '',
      customThemes: [],

      setTheme: (id) => set({ activeThemeId: id }),
      setCustomCSS: (css) => set({ customCSS: css }),
      addCustomTheme: (theme) =>
        set((s) => ({ customThemes: [...s.customThemes, theme] })),
      removeCustomTheme: (id) =>
        set((s) => ({ customThemes: s.customThemes.filter((t) => t.id !== id) })),
      allThemes: () => [...PRESET_THEMES, ...get().customThemes],
    }),
    { name: 'standby-theme' }
  )
)

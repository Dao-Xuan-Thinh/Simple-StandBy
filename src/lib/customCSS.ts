import { useThemeStore } from '../store/themeStore'
import { PRESET_THEMES } from '../themes'
import type { Theme } from '../types/widget'

/** Injects CSS variables from the active theme + custom CSS into the document root. */
export function applyTheme(theme: Theme, customCSS: string) {
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value)
  }

  let el = document.getElementById('standby-custom-css')
  if (!el) {
    el = document.createElement('style')
    el.id = 'standby-custom-css'
    document.head.appendChild(el)
  }
  el.textContent = customCSS
}

/** Call once at app startup to hydrate theme from store. */
export function hydrateTheme() {
  const { activeThemeId, customCSS, customThemes } = useThemeStore.getState()
  const all: Theme[] = [...PRESET_THEMES, ...customThemes]
  const theme = all.find((t) => t.id === activeThemeId) ?? PRESET_THEMES[0]
  applyTheme(theme, customCSS)
}

import { useState, useEffect } from "react"
import { StandbyCanvas } from "./components/canvas/StandbyCanvas"
import { SettingsPanel } from "./components/settings/SettingsPanel"
import { useScreenProtection } from "./hooks/useScreenProtection"
import { useWakeLock } from "./hooks/useWakeLock"
import { hydrateTheme, applyTheme } from "./lib/customCSS"
import { useThemeStore } from "./store/themeStore"
import { PRESET_THEMES } from "./themes"

hydrateTheme()

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { activeThemeId, customCSS, customThemes } = useThemeStore()

  useScreenProtection()
  useWakeLock()

  /* Re-apply theme whenever it changes */
  useEffect(() => {
    const all = [...PRESET_THEMES, ...customThemes]
    const theme = all.find((t) => t.id === activeThemeId) ?? PRESET_THEMES[0]
    applyTheme(theme, customCSS)
  }, [activeThemeId, customCSS, customThemes])

  return (
    <>
      <StandbyCanvas />

      {/* Settings trigger — tap top-right corner */}
      <button
        onClick={() => setSettingsOpen(true)}
        aria-label="Open Settings"
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 1000,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid var(--border)",
          background: "var(--widget-bg)",
          backdropFilter: "blur(8px)",
          color: "var(--text-secondary)",
          fontSize: 16,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.4,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.4")}
      >
        ⚙
      </button>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </>
  )
}

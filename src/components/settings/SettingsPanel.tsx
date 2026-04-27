import { useState } from 'react'
import { useThemeStore } from '../../store/themeStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useLayoutStore } from '../../store/layoutStore'
import { PRESET_THEMES } from '../../themes'
import { applyTheme } from '../../lib/customCSS'
import { CalendarManager } from '../widgets/CalendarWidget'
import { PhotoManager } from '../widgets/PhotoWidget'
import type { WidgetType } from '../../types/widget'

type Tab = 'layout' | 'theme' | 'widgets' | 'screen' | 'apis'

const WIDGET_OPTIONS: { type: WidgetType; label: string; emoji: string }[] = [
  { type: 'ios-clock', label: 'iOS Clock',  emoji: '🔵' },
  { type: 'clock',     label: 'Clock',      emoji: '🕐' },
  { type: 'date',      label: 'Date',       emoji: '📅' },
  { type: 'weather',   label: 'Weather',    emoji: '🌤' },
  { type: 'calendar',  label: 'Calendar',   emoji: '📆' },
  { type: 'music',     label: 'Music',      emoji: '🎵' },
  { type: 'photo',     label: 'Photo',      emoji: '🖼' },
]

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('layout')
  const { activeThemeId, customCSS, setTheme, setCustomCSS, allThemes } = useThemeStore()
  const { update, weatherApiKey, weatherCity, weatherUnit, spotifyClientId } = useSettingsStore()
  const { profiles, activeProfileId, editMode, setEditMode, setActiveProfile, addProfile, deleteProfile, addWidget } = useLayoutStore()
  const themes = allThemes()

  const inputStyle = {
    background: 'var(--widget-bg)',
    border: '1px solid var(--widget-border)',
    color: 'var(--text-primary)',
    borderRadius: 8,
    padding: '6px 10px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
  } as React.CSSProperties

  const labelStyle = { fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 } as React.CSSProperties

  const tabs: { id: Tab; label: string }[] = [
    { id: 'layout', label: 'Layout' },
    { id: 'theme', label: 'Theme' },
    { id: 'widgets', label: 'Widgets' },
    { id: 'screen', label: 'Screen' },
    { id: 'apis', label: 'APIs' },
  ]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: 'min(520px, 95vw)',
          maxHeight: '90vh',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>Settings</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '8px 12px', gap: 4, borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                background: tab === t.id ? 'var(--accent)' : 'var(--widget-bg)',
                color: tab === t.id ? '#fff' : 'var(--text-secondary)',
                transition: 'background 0.15s',
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── LAYOUT ─────────────────────────────────────────── */}
          {tab === 'layout' && (
            <>
              <div className="flex flex-col gap-2">
                <span style={labelStyle}>Layout Profiles</span>
                <div className="flex flex-wrap gap-2">
                  {profiles.map((p) => (
                    <div key={p.id} className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveProfile(p.id)}
                        style={{
                          padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
                          background: activeProfileId === p.id ? 'var(--accent)' : 'var(--widget-bg)',
                          color: activeProfileId === p.id ? '#fff' : 'var(--text-primary)',
                        }}
                      >{p.name}</button>
                      {profiles.length > 1 && (
                        <button onClick={() => deleteProfile(p.id)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>✕</button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => { const n = prompt('Profile name:'); if (n) addProfile(n) }}
                    style={{ padding: '5px 12px', borderRadius: 8, border: '1px dashed var(--border)', background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}
                  >+ New</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  style={{ padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, background: editMode ? '#f87171' : 'var(--accent)', color: '#fff' }}
                >
                  {editMode ? '✓ Done Editing' : '✏️ Edit Layout'}
                </button>
                {editMode && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Drag widgets to reposition. Tap ✕ to remove.</span>}
              </div>
            </>
          )}

          {/* ── THEME ─────────────────────────────────────────── */}
          {tab === 'theme' && (
            <>
              <div className="flex flex-col gap-2">
                <span style={labelStyle}>Preset Themes</span>
                <div className="flex flex-wrap gap-2">
                  {themes.map((t) => (
                    <button key={t.id}
                      onClick={() => { setTheme(t.id); const theme = themes.find(x => x.id === t.id); if (theme) applyTheme(theme, customCSS) }}
                      style={{
                        padding: '6px 14px', borderRadius: 10, border: `2px solid ${activeThemeId === t.id ? 'var(--accent)' : 'var(--border)'}`,
                        background: activeThemeId === t.id ? 'var(--accent)' : 'var(--widget-bg)',
                        color: activeThemeId === t.id ? '#fff' : 'var(--text-primary)',
                        cursor: 'pointer', fontSize: 13, fontWeight: 500,
                      }}
                    >{t.name}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span style={labelStyle}>Custom CSS <span style={{ color: 'var(--text-secondary)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(scoped to .standby-canvas)</span></span>
                <textarea
                  value={customCSS}
                  onChange={(e) => { setCustomCSS(e.target.value); applyTheme(themes.find(t => t.id === activeThemeId) ?? PRESET_THEMES[0], e.target.value) }}
                  rows={10}
                  placeholder={`.standby-canvas {\n  /* your CSS here */\n}\n\n/* Example: change clock color */\n.standby-canvas .clock {\n  color: hotpink;\n}`}
                  style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </>
          )}

          {/* ── WIDGETS ──────────────────────────────────────── */}
          {tab === 'widgets' && (
            <>
              <div className="flex flex-col gap-2">
                <span style={labelStyle}>Add Widget</span>
                <div className="flex flex-wrap gap-2">
                  {WIDGET_OPTIONS.map((w) => (
                    <button key={w.type}
                      onClick={() => addWidget({ type: w.type, position: { x: 40, y: 40 }, size: { w: 240, h: 120 }, zIndex: 2, config: {} })}
                      style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--widget-bg)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13 }}
                    >{w.emoji} {w.label}</button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span style={labelStyle}>Photos</span>
                <PhotoManager />
              </div>
              <div className="flex flex-col gap-2">
                <span style={labelStyle}>Calendar Events</span>
                <CalendarManager />
              </div>
            </>
          )}

          {/* ── SCREEN ────────────────────────────────────────── */}
          {tab === 'screen' && (
            <>
              {([
                { key: 'pixelShiftEnabled', label: 'Pixel Shift (burn-in protection)', type: 'toggle' },
                { key: 'pixelShiftIntervalSec', label: 'Shift interval (seconds)', type: 'number', min: 10, max: 600 },
                { key: 'autoDimEnabled', label: 'Auto-dim when idle', type: 'toggle' },
                { key: 'autoDimDelaySec', label: 'Dim after (seconds)', type: 'number', min: 10, max: 600 },
                { key: 'autoDimPercent', label: 'Dim to (% brightness)', type: 'number', min: 1, max: 80 },
                { key: 'wakeLockEnabled', label: 'Keep screen on (Wake Lock)', type: 'toggle' },
                { key: 'reducedMotion', label: 'Reduced motion / power-saver', type: 'toggle' },
              ] as const).map(({ key, label, type, ...rest }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{label}</span>
                  {type === 'toggle' ? (
                    <button
                      onClick={() => update(key, !useSettingsStore.getState()[key] as boolean)}
                      style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative',
                        background: useSettingsStore.getState()[key] ? 'var(--accent)' : 'var(--border)',
                        transition: 'background 0.2s',
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: 2, borderRadius: '50%', width: 20, height: 20, background: '#fff',
                        left: useSettingsStore.getState()[key] ? 22 : 2, transition: 'left 0.2s',
                      }} />
                    </button>
                  ) : (
                    <input
                      type="number"
                      value={useSettingsStore.getState()[key] as number}
                      onChange={(e) => update(key, Number(e.target.value) as never)}
                      style={{ ...inputStyle, width: 80, textAlign: 'center' }}
                      {...rest}
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {/* ── APIS ──────────────────────────────────────────── */}
          {tab === 'apis' && (
            <>
              <div className="flex flex-col gap-2">
                <span style={labelStyle}>OpenWeatherMap</span>
                <input value={weatherApiKey} onChange={(e) => update('weatherApiKey', e.target.value)} placeholder="API Key (free at openweathermap.org)" style={inputStyle} />
                <input value={weatherCity} onChange={(e) => update('weatherCity', e.target.value)} placeholder="City name (e.g. London)" style={inputStyle} />
                <select value={weatherUnit} onChange={(e) => update('weatherUnit', e.target.value as 'metric' | 'imperial')} style={inputStyle}>
                  <option value="metric">Celsius (°C)</option>
                  <option value="imperial">Fahrenheit (°F)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <span style={labelStyle}>Spotify</span>
                <input value={spotifyClientId} onChange={(e) => update('spotifyClientId', e.target.value)} placeholder="Spotify Client ID (from developer.spotify.com)" style={inputStyle} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Add <code style={{ background: 'var(--widget-bg)', padding: '1px 4px', borderRadius: 4 }}>{window.location.origin}</code> as a Redirect URI in your Spotify app settings.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

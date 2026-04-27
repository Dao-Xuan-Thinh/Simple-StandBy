import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WidgetInstance, LayoutProfile } from '../types/widget'
import { nanoid } from '../lib/nanoid'

const DEFAULT_WIDGETS: WidgetInstance[] = [
  { id: 'w-clock', type: 'clock',   position: { x: 40, y: 30 }, size: { w: 320, h: 160 }, zIndex: 1, config: { mode: 'digital', showSeconds: true } },
  { id: 'w-date',  type: 'date',    position: { x: 40, y: 200 }, size: { w: 320, h: 60 },  zIndex: 1, config: { format: 'dddd, MMMM D' } },
  { id: 'w-weather', type: 'weather', position: { x: 40, y: 290 }, size: { w: 200, h: 100 }, zIndex: 1, config: {} },
]

const DEFAULT_PROFILE: LayoutProfile = {
  id: 'default',
  name: 'Default',
  widgets: DEFAULT_WIDGETS,
}

const IOS_PROFILE: LayoutProfile = {
  id: 'ios',
  name: 'iOS',
  widgets: [
    {
      id: 'w-ios-clock',
      type: 'ios-clock',
      position: { x: 0, y: 0 },
      size: { w: 100, h: 100 },
      zIndex: 0,
      config: { use24h: true, showSecondsIndicator: true },
    },
  ],
}

interface LayoutState {
  profiles: LayoutProfile[]
  activeProfileId: string
  editMode: boolean

  activeWidgets: () => WidgetInstance[]
  setEditMode: (v: boolean) => void
  setActiveProfile: (id: string) => void
  addProfile: (name: string) => void
  renameProfile: (id: string, name: string) => void
  deleteProfile: (id: string) => void

  addWidget: (widget: Omit<WidgetInstance, 'id'>) => void
  removeWidget: (widgetId: string) => void
  updateWidget: (widgetId: string, patch: Partial<WidgetInstance>) => void
  moveWidget: (widgetId: string, position: { x: number; y: number }) => void
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      profiles: [DEFAULT_PROFILE, IOS_PROFILE],
      activeProfileId: 'default',
      editMode: false,

      activeWidgets: () => {
        const { profiles, activeProfileId } = get()
        return profiles.find((p) => p.id === activeProfileId)?.widgets ?? []
      },

      setEditMode: (v) => set({ editMode: v }),
      setActiveProfile: (id) => set({ activeProfileId: id }),

      addProfile: (name) =>
        set((s) => {
          const id = nanoid()
          return { profiles: [...s.profiles, { id, name, widgets: [] }], activeProfileId: id }
        }),

      renameProfile: (id, name) =>
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === id ? { ...p, name } : p)),
        })),

      deleteProfile: (id) =>
        set((s) => {
          const remaining = s.profiles.filter((p) => p.id !== id)
          return {
            profiles: remaining.length ? remaining : [DEFAULT_PROFILE],
            activeProfileId: remaining[0]?.id ?? 'default',
          }
        }),

      addWidget: (widget) =>
        set((s) => {
          const newW: WidgetInstance = { ...widget, id: nanoid() }
          return {
            profiles: s.profiles.map((p) =>
              p.id === s.activeProfileId ? { ...p, widgets: [...p.widgets, newW] } : p
            ),
          }
        }),

      removeWidget: (widgetId) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === s.activeProfileId
              ? { ...p, widgets: p.widgets.filter((w) => w.id !== widgetId) }
              : p
          ),
        })),

      updateWidget: (widgetId, patch) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === s.activeProfileId
              ? { ...p, widgets: p.widgets.map((w) => (w.id === widgetId ? { ...w, ...patch } : w)) }
              : p
          ),
        })),

      moveWidget: (widgetId, position) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === s.activeProfileId
              ? { ...p, widgets: p.widgets.map((w) => (w.id === widgetId ? { ...w, position } : w)) }
              : p
          ),
        })),
    }),
    { name: 'standby-layout' }
  )
)

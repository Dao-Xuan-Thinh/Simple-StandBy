import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  /* Screen protection */
  pixelShiftEnabled: boolean
  pixelShiftIntervalSec: number
  autoDimEnabled: boolean
  autoDimDelaySec: number
  autoDimPercent: number
  wakeLockEnabled: boolean
  reducedMotion: boolean

  /* Weather */
  weatherApiKey: string
  weatherCity: string
  weatherUnit: 'metric' | 'imperial'

  /* Spotify */
  spotifyClientId: string

  update: <K extends keyof Omit<SettingsState, 'update'>>(key: K, value: SettingsState[K]) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      pixelShiftEnabled: true,
      pixelShiftIntervalSec: 60,
      autoDimEnabled: true,
      autoDimDelaySec: 120,
      autoDimPercent: 15,
      wakeLockEnabled: true,
      reducedMotion: false,

      weatherApiKey: '',
      weatherCity: '',
      weatherUnit: 'metric',

      spotifyClientId: '',

      update: (key, value) => set({ [key]: value } as Pick<SettingsState, typeof key>),
    }),
    { name: 'standby-settings' }
  )
)

export { amoledTheme } from './amoled'
export { darkTheme } from './dark'
export { lightTheme } from './light'
export { retroTheme } from './retro'
export { neonTheme } from './neon'

import { amoledTheme } from './amoled'
import { darkTheme } from './dark'
import { lightTheme } from './light'
import { retroTheme } from './retro'
import { neonTheme } from './neon'
import type { Theme } from '../types/widget'

export const PRESET_THEMES: Theme[] = [amoledTheme, darkTheme, lightTheme, retroTheme, neonTheme]

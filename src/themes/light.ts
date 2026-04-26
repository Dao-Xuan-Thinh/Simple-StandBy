import type { Theme } from '../types/widget'

export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  vars: {
    '--bg-primary': '#f2f2f7',
    '--bg-secondary': '#ffffff',
    '--text-primary': '#1c1c1e',
    '--text-secondary': '#6c6c70',
    '--accent': '#007aff',
    '--accent-glow': 'rgba(0,122,255,0.2)',
    '--border': 'rgba(0,0,0,0.1)',
    '--widget-bg': 'rgba(255,255,255,0.8)',
    '--widget-border': 'rgba(0,0,0,0.08)',
    '--shadow': '0 4px 32px rgba(0,0,0,0.12)',
  },
}

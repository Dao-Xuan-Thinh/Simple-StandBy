import type { Theme } from '../types/widget'

export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  vars: {
    '--bg-primary': '#0f0f0f',
    '--bg-secondary': '#1c1c1e',
    '--text-primary': '#f5f5f7',
    '--text-secondary': '#98989d',
    '--accent': '#0a84ff',
    '--accent-glow': 'rgba(10,132,255,0.3)',
    '--border': 'rgba(255,255,255,0.1)',
    '--widget-bg': 'rgba(255,255,255,0.07)',
    '--widget-border': 'rgba(255,255,255,0.12)',
    '--shadow': '0 4px 32px rgba(0,0,0,0.7)',
  },
}

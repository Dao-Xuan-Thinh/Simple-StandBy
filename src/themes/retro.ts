import type { Theme } from '../types/widget'

export const retroTheme: Theme = {
  id: 'retro',
  name: 'Retro CRT',
  vars: {
    '--bg-primary': '#0d1f0d',
    '--bg-secondary': '#142114',
    '--text-primary': '#39ff14',
    '--text-secondary': '#2aaa0e',
    '--accent': '#39ff14',
    '--accent-glow': 'rgba(57,255,20,0.35)',
    '--border': 'rgba(57,255,20,0.2)',
    '--widget-bg': 'rgba(57,255,20,0.04)',
    '--widget-border': 'rgba(57,255,20,0.15)',
    '--shadow': '0 0 24px rgba(57,255,20,0.2)',
    '--font-display': '"Courier New", Courier, monospace',
  },
}

import { useEffect, useRef, useCallback } from 'react'
import { useSettingsStore } from '../store/settingsStore'

/** Applies pixel-shift anti-burn-in and auto-dim screen protection. */
export function useScreenProtection() {
  const {
    pixelShiftEnabled,
    pixelShiftIntervalSec,
    autoDimEnabled,
    autoDimDelaySec,
    autoDimPercent,
  } = useSettingsStore()

  const dimTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shiftTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const shiftRef = useRef({ x: 0, y: 0 })

  /* ── Pixel Shift ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!pixelShiftEnabled) return
    shiftTimer.current = setInterval(() => {
      shiftRef.current = {
        x: Math.round((Math.random() - 0.5) * 8),
        y: Math.round((Math.random() - 0.5) * 8),
      }
      const canvas = document.querySelector<HTMLElement>('.standby-canvas')
      if (canvas) {
        canvas.style.transform = `translate(${shiftRef.current.x}px, ${shiftRef.current.y}px)`
      }
    }, pixelShiftIntervalSec * 1000)
    return () => { if (shiftTimer.current) clearInterval(shiftTimer.current) }
  }, [pixelShiftEnabled, pixelShiftIntervalSec])

  /* ── Auto Dim ─────────────────────────────────────────────────── */
  const dim = useCallback(() => {
    document.documentElement.style.setProperty('--dim-opacity', (autoDimPercent / 100).toString())
  }, [autoDimPercent])

  const undim = useCallback(() => {
    document.documentElement.style.setProperty('--dim-opacity', '1')
  }, [])

  const resetDimTimer = useCallback(() => {
    if (!autoDimEnabled) return
    undim()
    if (dimTimer.current) clearTimeout(dimTimer.current)
    dimTimer.current = setTimeout(dim, autoDimDelaySec * 1000)
  }, [autoDimEnabled, autoDimDelaySec, dim, undim])

  useEffect(() => {
    if (!autoDimEnabled) { undim(); return }
    const events = ['pointermove', 'pointerdown', 'keydown', 'touchstart']
    events.forEach((e) => window.addEventListener(e, resetDimTimer, { passive: true }))
    resetDimTimer()
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetDimTimer))
      if (dimTimer.current) clearTimeout(dimTimer.current)
    }
  }, [autoDimEnabled, resetDimTimer, undim])
}

import { useEffect, useRef } from 'react'
import { useSettingsStore } from '../store/settingsStore'

export function useWakeLock() {
  const { wakeLockEnabled } = useSettingsStore()
  const lockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!wakeLockEnabled || !('wakeLock' in navigator)) return

    const acquire = async () => {
      try {
        lockRef.current = await (navigator as Navigator & { wakeLock: { request: (type: string) => Promise<WakeLockSentinel> } }).wakeLock.request('screen')
      } catch {
        // Wake Lock not available or denied — silently ignore
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') acquire()
    }

    acquire()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      lockRef.current?.release()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [wakeLockEnabled])
}

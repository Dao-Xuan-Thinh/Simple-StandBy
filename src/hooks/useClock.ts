import { useState, useEffect } from 'react'

export interface ClockData {
  hours: number
  minutes: number
  seconds: number
  ampm: 'AM' | 'PM'
  hours12: number
}

export function useClock(): ClockData {
  const tick = (): ClockData => {
    const now = new Date()
    const h = now.getHours()
    return {
      hours: h,
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      ampm: h >= 12 ? 'PM' : 'AM',
      hours12: h % 12 || 12,
    }
  }

  const [data, setData] = useState<ClockData>(tick)

  useEffect(() => {
    const id = setInterval(() => setData(tick()), 1000)
    return () => clearInterval(id)
  }, [])

  return data
}

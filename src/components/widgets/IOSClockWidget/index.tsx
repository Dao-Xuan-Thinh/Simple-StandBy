import { useState, useEffect, useRef } from 'react'
import { useClock } from '../../../hooks/useClock'
import './style.css'

/** Animates a single digit character when its value changes. */
function AnimDigit({ digit }: { digit: string }) {
  const [displayDigit, setDisplayDigit] = useState(digit)
  const [animKey, setAnimKey] = useState(0)
  const prevRef = useRef(digit)

  useEffect(() => {
    if (digit !== prevRef.current) {
      prevRef.current = digit
      setDisplayDigit(digit)
      setAnimKey((k) => k + 1)
    }
  }, [digit])

  return (
    <span
      key={animKey}
      className={`ios-digit-char${animKey > 0 ? ' ios-digit-enter' : ''}`}
    >
      {displayDigit}
    </span>
  )
}

/** Two spherical dots — the iOS-style colon separator. */
function IOSColon() {
  return (
    <div className="ios-colon-wrap">
      <div className="ios-colon-dot" />
      <div className="ios-colon-dot" />
    </div>
  )
}

export interface IOSClockConfig {
  use24h?: boolean
  showSecondsIndicator?: boolean
}

export function IOSClockWidget({ config = {} }: { config?: IOSClockConfig }) {
  const { use24h = true, showSecondsIndicator = true } = config
  const { hours, hours12, minutes } = useClock()

  const rawHours = use24h ? hours : hours12
  // 24h always has leading zero; 12h drops it (matches iOS StandBy behaviour)
  const hoursStr = use24h
    ? String(rawHours).padStart(2, '0')
    : String(rawHours)

  const minutesStr = String(minutes).padStart(2, '0')

  return (
    <div className="ios-clock-root">
      <div className="ios-clock-inner">
        <div className="ios-digit-group">
          {hoursStr.split('').map((d, i) => (
            <AnimDigit key={i} digit={d} />
          ))}
        </div>

        <IOSColon />

        <div className="ios-digit-group">
          {minutesStr.split('').map((d, i) => (
            <AnimDigit key={i} digit={d} />
          ))}
        </div>
      </div>

      {showSecondsIndicator && <div className="ios-sec-dot" />}
    </div>
  )
}

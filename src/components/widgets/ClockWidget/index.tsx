import { useClock } from '../../../hooks/useClock'

interface ClockConfig {
  mode?: 'digital' | 'analog'
  showSeconds?: boolean
  use24h?: boolean
}

interface Props {
  config: ClockConfig
}

export function ClockWidget({ config }: Props) {
  const { hours, minutes, seconds, ampm, hours12 } = useClock()
  const { mode = 'digital', showSeconds = true, use24h = false } = config

  if (mode === 'analog') {
    const secDeg = seconds * 6
    const minDeg = minutes * 6 + seconds * 0.1
    const hrDeg = (use24h ? hours % 12 : hours12) * 30 + minutes * 0.5
    return (
      <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Face */}
          <circle cx="50" cy="50" r="48" fill="none" stroke="var(--widget-border)" strokeWidth="1.5" />
          {/* Tick marks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180
            const x1 = 50 + 40 * Math.sin(a)
            const y1 = 50 - 40 * Math.cos(a)
            const x2 = 50 + 44 * Math.sin(a)
            const y2 = 50 - 44 * Math.cos(a)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-secondary)" strokeWidth="1.5" />
          })}
          {/* Hour hand */}
          <line
            x1="50" y1="50"
            x2={50 + 28 * Math.sin((hrDeg * Math.PI) / 180)}
            y2={50 - 28 * Math.cos((hrDeg * Math.PI) / 180)}
            stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round"
          />
          {/* Minute hand */}
          <line
            x1="50" y1="50"
            x2={50 + 38 * Math.sin((minDeg * Math.PI) / 180)}
            y2={50 - 38 * Math.cos((minDeg * Math.PI) / 180)}
            stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round"
          />
          {/* Second hand */}
          {showSeconds && (
            <line
              x1="50" y1="50"
              x2={50 + 40 * Math.sin((secDeg * Math.PI) / 180)}
              y2={50 - 40 * Math.cos((secDeg * Math.PI) / 180)}
              stroke="var(--accent)" strokeWidth="1" strokeLinecap="round"
            />
          )}
          <circle cx="50" cy="50" r="2.5" fill="var(--accent)" />
        </svg>
      </div>
    )
  }

  const displayHours = use24h ? String(hours).padStart(2, '0') : String(hours12).padStart(2, '0')
  const displayMins = String(minutes).padStart(2, '0')
  const displaySecs = String(seconds).padStart(2, '0')

  return (
    <div className="flex items-baseline gap-1 leading-none" style={{ color: 'var(--text-primary)' }}>
      <span className="font-thin tabular-nums" style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}>
        {displayHours}:{displayMins}
      </span>
      {showSeconds && (
        <span className="font-thin tabular-nums" style={{ fontSize: 'clamp(24px, 4vw, 56px)', color: 'var(--text-secondary)' }}>
          :{displaySecs}
        </span>
      )}
      {!use24h && (
        <span className="font-light" style={{ fontSize: 'clamp(14px, 2vw, 28px)', color: 'var(--accent)' }}>
          {ampm}
        </span>
      )}
    </div>
  )
}

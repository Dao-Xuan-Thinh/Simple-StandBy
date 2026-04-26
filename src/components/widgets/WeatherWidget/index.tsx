import { useWeather } from '../../../hooks/useWeather'
import { useSettingsStore } from '../../../store/settingsStore'

export function WeatherWidget() {
  const { data, loading, error } = useWeather()
  const { weatherUnit, weatherApiKey } = useSettingsStore()
  const unit = weatherUnit === 'metric' ? '°C' : '°F'

  if (!weatherApiKey) {
    return (
      <div className="flex flex-col gap-1" style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
        <span>⚠️ Add Weather API key in settings</span>
      </div>
    )
  }

  if (loading && !data) {
    return <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading weather…</div>
  }

  if (error) {
    return <div style={{ color: '#f87171', fontSize: 12 }}>Weather error: {error}</div>
  }

  if (!data) return null

  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`

  return (
    <div className="flex items-center gap-3">
      <img src={iconUrl} alt={data.description} width={48} height={48} style={{ filter: 'drop-shadow(0 0 6px var(--accent-glow))' }} />
      <div className="flex flex-col">
        <span style={{ fontSize: 'clamp(24px, 5vw, 48px)', fontWeight: 200, color: 'var(--text-primary)', lineHeight: 1 }}>
          {data.temp}{unit}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
          {data.description}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
          {data.city} · 💧{data.humidity}% · 💨{data.wind}m/s
        </span>
      </div>
    </div>
  )
}

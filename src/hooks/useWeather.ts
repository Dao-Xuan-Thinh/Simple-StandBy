import { useState, useEffect, useCallback } from 'react'
import { useSettingsStore } from '../store/settingsStore'

export interface WeatherData {
  temp: number
  feels_like: number
  description: string
  icon: string
  city: string
  humidity: number
  wind: number
}

const CACHE_KEY = 'standby-weather-cache'
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

function loadCache(): { data: WeatherData; ts: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useWeather() {
  const { weatherApiKey, weatherCity, weatherUnit } = useSettingsStore()
  const [data, setData] = useState<WeatherData | null>(() => {
    const c = loadCache()
    return c && Date.now() - c.ts < CACHE_TTL ? c.data : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    if (!weatherApiKey || !weatherCity) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(weatherCity)}&appid=${weatherApiKey}&units=${weatherUnit}`
      )
      if (!res.ok) throw new Error(`Weather API error ${res.status}`)
      const json = await res.json()
      const parsed: WeatherData = {
        temp: Math.round(json.main.temp),
        feels_like: Math.round(json.main.feels_like),
        description: json.weather[0].description,
        icon: json.weather[0].icon,
        city: json.name,
        humidity: json.main.humidity,
        wind: Math.round(json.wind.speed),
      }
      setData(parsed)
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: parsed, ts: Date.now() }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [weatherApiKey, weatherCity, weatherUnit])

  useEffect(() => {
    const cache = loadCache()
    if (!cache || Date.now() - cache.ts >= CACHE_TTL) fetch_()
    const id = setInterval(fetch_, CACHE_TTL)
    return () => clearInterval(id)
  }, [fetch_])

  return { data, loading, error, refresh: fetch_ }
}

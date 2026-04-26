import { useState, useEffect, useCallback } from 'react'
import { useSettingsStore } from '../store/settingsStore'

export interface SpotifyTrack {
  name: string
  artist: string
  album: string
  albumArt: string
  isPlaying: boolean
  progress: number
  duration: number
}

const SCOPES = 'user-read-playback-state user-read-currently-playing'
const REDIRECT = window.location.origin + window.location.pathname

export function useSpotify() {
  const { spotifyClientId } = useSettingsStore()
  const [token, setToken] = useState<string | null>(() => {
    const t = sessionStorage.getItem('spotify_token')
    const exp = Number(sessionStorage.getItem('spotify_token_exp') || 0)
    return t && Date.now() < exp ? t : null
  })
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [error, setError] = useState<string | null>(null)

  /* Handle OAuth implicit flow callback — token arrives in URL hash */
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const accessToken = params.get('access_token')
    const expiresIn = params.get('expires_in')
    if (accessToken) {
      sessionStorage.setItem('spotify_token', accessToken)
      sessionStorage.setItem('spotify_token_exp', String(Date.now() + Number(expiresIn) * 1000))
      setToken(accessToken)
      history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const login = useCallback(() => {
    if (!spotifyClientId) return
    const url = new URL('https://accounts.spotify.com/authorize')
    url.searchParams.set('response_type', 'token')
    url.searchParams.set('client_id', spotifyClientId)
    url.searchParams.set('scope', SCOPES)
    url.searchParams.set('redirect_uri', REDIRECT)
    window.location.href = url.toString()
  }, [spotifyClientId])

  const logout = useCallback(() => {
    sessionStorage.removeItem('spotify_token')
    sessionStorage.removeItem('spotify_token_exp')
    setToken(null)
    setTrack(null)
  }, [])

  const poll = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 204) { setTrack(null); return }
      if (res.status === 401) { logout(); return }
      const json = await res.json()
      if (!json.item) { setTrack(null); return }
      setTrack({
        name: json.item.name,
        artist: json.item.artists.map((a: { name: string }) => a.name).join(', '),
        album: json.item.album.name,
        albumArt: json.item.album.images[0]?.url ?? '',
        isPlaying: json.is_playing,
        progress: json.progress_ms,
        duration: json.item.duration_ms,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Spotify error')
    }
  }, [token, logout])

  useEffect(() => {
    if (!token) return
    poll()
    const id = setInterval(poll, 5000)
    return () => clearInterval(id)
  }, [token, poll])

  return { token, track, error, login, logout }
}

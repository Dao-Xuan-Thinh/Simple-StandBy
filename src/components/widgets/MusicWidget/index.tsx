import { useSpotify } from '../../../hooks/useSpotify'

export function MusicWidget() {
  const { token, track, error, login } = useSpotify()

  if (!token) {
    return (
      <button
        onClick={login}
        className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
        style={{ background: '#1DB954', color: '#fff' }}
      >
        <span>♫</span> Connect Spotify
      </button>
    )
  }

  if (error) return <div style={{ fontSize: 11, color: '#f87171' }}>{error}</div>

  if (!track) {
    return <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No track playing</div>
  }

  const progress = track.duration > 0 ? (track.progress / track.duration) * 100 : 0

  return (
    <div className="flex items-center gap-3" style={{ maxWidth: 320 }}>
      {track.albumArt && (
        <img
          src={track.albumArt}
          alt={track.album}
          width={52} height={52}
          className="rounded-lg flex-shrink-0"
          style={{ boxShadow: '0 0 16px var(--accent-glow)' }}
        />
      )}
      <div className="flex flex-col gap-1 min-w-0">
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track.isPlaying ? '▶ ' : '⏸ '}{track.name}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track.artist}
        </span>
        <div style={{ height: 2, background: 'var(--widget-border)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#1DB954', transition: 'width 1s linear' }} />
        </div>
      </div>
    </div>
  )
}

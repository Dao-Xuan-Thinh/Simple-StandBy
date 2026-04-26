import { useState, useEffect, useRef } from 'react'

interface PhotoConfig {
  slideshow?: boolean
  slideshowIntervalSec?: number
  fit?: 'cover' | 'contain'
}

interface Props { config: PhotoConfig }

const STORAGE_KEY = 'standby-photos'

function loadPhotos(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function PhotoWidget({ config }: Props) {
  const { slideshow = true, slideshowIntervalSec = 15, fit = 'cover' } = config
  const photos = loadPhotos()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!slideshow || photos.length <= 1) return
    const id = setInterval(() => setIdx((i) => (i + 1) % photos.length), slideshowIntervalSec * 1000)
    return () => clearInterval(id)
  }, [slideshow, slideshowIntervalSec, photos.length])

  if (photos.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl text-xs"
        style={{ width: '100%', height: '100%', minWidth: 120, minHeight: 80, background: 'var(--widget-bg)', border: '1px dashed var(--widget-border)', color: 'var(--text-secondary)' }}
      >
        📷 No photos — add in settings
      </div>
    )
  }

  return (
    <img
      src={photos[idx]}
      alt="Photo"
      className="rounded-xl"
      style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }}
    />
  )
}

/* Manager component used in settings */
export function PhotoManager() {
  const [photos, setPhotos] = useState<string[]>(loadPhotos)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        setPhotos((prev) => {
          const next = [...prev, url]
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
          return next
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const remove = (i: number) => {
    const next = photos.filter((_, j) => j !== i)
    setPhotos(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => inputRef.current?.click()}
        className="rounded px-3 py-2 text-sm font-medium"
        style={{ background: 'var(--accent)', color: '#fff', width: 'fit-content' }}
      >
        + Upload photos
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
      <div className="flex flex-wrap gap-2">
        {photos.map((url, i) => (
          <div key={i} className="relative">
            <img src={url} alt="" width={64} height={64} className="rounded object-cover" />
            <button
              onClick={() => remove(i)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
              style={{ background: '#f87171', color: '#fff', lineHeight: 1 }}
            >✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

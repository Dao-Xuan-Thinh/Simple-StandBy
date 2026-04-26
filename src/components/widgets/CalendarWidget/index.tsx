import { useState } from 'react'
import { nanoid } from '../../../lib/nanoid'

interface CalendarEvent {
  id: string
  title: string
  time: string
  date: string
}

const STORAGE_KEY = 'standby-calendar-events'

function loadEvents(): CalendarEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveEvents(events: CalendarEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export function CalendarWidget() {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const events = loadEvents()

  const todayEvents = events
    .filter((e) => e.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time))

  const upcomingEvents = events
    .filter((e) => e.date > todayStr)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3)

  const displayEvents = todayEvents.length ? todayEvents : upcomingEvents

  return (
    <div className="flex flex-col gap-1.5" style={{ minWidth: 200 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent)' }}>
        {todayEvents.length ? "Today" : "Upcoming"}
      </span>
      {displayEvents.length === 0 && (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>No events — add some in settings</span>
      )}
      {displayEvents.map((ev) => (
        <div key={ev.id} className="flex items-center gap-2">
          <span style={{ fontSize: 11, color: 'var(--accent)', minWidth: 36 }}>{ev.time}</span>
          <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{ev.title}</span>
        </div>
      ))}
    </div>
  )
}

/* Manager component used in settings */
export function CalendarManager() {
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('09:00')

  const add = () => {
    if (!title.trim()) return
    const updated = [...events, { id: nanoid(), title: title.trim(), date, time }]
    setEvents(updated)
    saveEvents(updated)
    setTitle('')
  }

  const remove = (id: string) => {
    const updated = events.filter((e) => e.id !== id)
    setEvents(updated)
    saveEvents(updated)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        <input
          value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="flex-1 rounded px-2 py-1 text-sm"
          style={{ background: 'var(--widget-bg)', border: '1px solid var(--widget-border)', color: 'var(--text-primary)', minWidth: 120 }}
        />
        <input
          type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="rounded px-2 py-1 text-sm"
          style={{ background: 'var(--widget-bg)', border: '1px solid var(--widget-border)', color: 'var(--text-primary)' }}
        />
        <input
          type="time" value={time} onChange={(e) => setTime(e.target.value)}
          className="rounded px-2 py-1 text-sm"
          style={{ background: 'var(--widget-bg)', border: '1px solid var(--widget-border)', color: 'var(--text-primary)' }}
        />
        <button onClick={add} className="rounded px-3 py-1 text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
          Add
        </button>
      </div>
      <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
        {events.sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time)).map((ev) => (
          <div key={ev.id} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent)' }}>{ev.date} {ev.time}</span>
            <span style={{ flex: 1, color: 'var(--text-primary)' }}>{ev.title}</span>
            <button onClick={() => remove(ev.id)} style={{ color: '#f87171' }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

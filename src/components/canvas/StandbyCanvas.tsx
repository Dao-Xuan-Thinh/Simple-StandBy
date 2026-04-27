import { useLayoutStore } from '../../store/layoutStore'
import { WidgetWrapper } from './WidgetWrapper'
import { ClockWidget } from '../widgets/ClockWidget'
import { DateWidget } from '../widgets/DateWidget'
import { WeatherWidget } from '../widgets/WeatherWidget'
import { CalendarWidget } from '../widgets/CalendarWidget'
import { MusicWidget } from '../widgets/MusicWidget'
import { PhotoWidget } from '../widgets/PhotoWidget'
import { IOSClockWidget } from '../widgets/IOSClockWidget'
import type { IOSClockConfig } from '../widgets/IOSClockWidget'
import type { WidgetInstance } from '../../types/widget'

function renderWidget(widget: WidgetInstance) {
  const cfg = widget.config
  switch (widget.type) {
    case 'clock':    return <ClockWidget config={cfg as Parameters<typeof ClockWidget>[0]['config']} />
    case 'date':     return <DateWidget config={cfg as Parameters<typeof DateWidget>[0]['config']} />
    case 'weather':  return <WeatherWidget />
    case 'calendar': return <CalendarWidget />
    case 'music':    return <MusicWidget />
    case 'photo':    return <PhotoWidget config={cfg as Parameters<typeof PhotoWidget>[0]['config']} />
    case 'ios-clock': return null // rendered separately as fullscreen
  }
}

export function StandbyCanvas() {
  const { activeWidgets, editMode, removeWidget } = useLayoutStore()
  const widgets = activeWidgets()

  const fullscreenWidgets = widgets.filter((w) => w.type === 'ios-clock')
  const regularWidgets = widgets.filter((w) => w.type !== 'ios-clock')

  return (
    <div className="standby-canvas">
      {/* Fullscreen widgets fill the entire canvas, bypassing WidgetWrapper */}
      {fullscreenWidgets.map((w) => (
        <div
          key={w.id}
          style={{ position: 'absolute', inset: 0, zIndex: w.zIndex }}
        >
          <IOSClockWidget config={w.config as IOSClockConfig} />
          {editMode && (
            <div
              style={{
                position: 'absolute', inset: 0,
                border: '2px dashed rgba(248,113,113,0.6)',
                borderRadius: 4,
                display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
                padding: 8, pointerEvents: 'auto',
              }}
            >
              <button
                onClick={() => removeWidget(w.id)}
                style={{
                  background: '#f87171', border: 'none', borderRadius: '50%',
                  width: 28, height: 28, color: '#fff', fontWeight: 700,
                  fontSize: 16, cursor: 'pointer', lineHeight: '28px', textAlign: 'center',
                }}
              >✕</button>
            </div>
          )}
        </div>
      ))}

      {/* Regular widgets in their WidgetWrapper shells */}
      {regularWidgets.map((w) => (
        <WidgetWrapper key={w.id} widget={w} editMode={editMode}>
          {renderWidget(w)}
        </WidgetWrapper>
      ))}
    </div>
  )
}

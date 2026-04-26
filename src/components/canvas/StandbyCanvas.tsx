import { useLayoutStore } from '../../store/layoutStore'
import { WidgetWrapper } from './WidgetWrapper'
import { ClockWidget } from '../widgets/ClockWidget'
import { DateWidget } from '../widgets/DateWidget'
import { WeatherWidget } from '../widgets/WeatherWidget'
import { CalendarWidget } from '../widgets/CalendarWidget'
import { MusicWidget } from '../widgets/MusicWidget'
import { PhotoWidget } from '../widgets/PhotoWidget'
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
    default:         return null
  }
}

export function StandbyCanvas() {
  const { activeWidgets, editMode } = useLayoutStore()
  const widgets = activeWidgets()

  return (
    <div className="standby-canvas">
      {widgets.map((w) => (
        <WidgetWrapper key={w.id} widget={w} editMode={editMode}>
          {renderWidget(w)}
        </WidgetWrapper>
      ))}
    </div>
  )
}

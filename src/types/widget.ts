export type WidgetType =
  | 'clock'
  | 'date'
  | 'weather'
  | 'calendar'
  | 'music'
  | 'photo'
  | 'ios-clock'

export interface WidgetPosition {
  x: number
  y: number
}

export interface WidgetSize {
  w: number
  h: number
}

export interface WidgetInstance {
  id: string
  type: WidgetType
  position: WidgetPosition
  size: WidgetSize
  zIndex: number
  config: Record<string, unknown>
}

export interface LayoutProfile {
  id: string
  name: string
  widgets: WidgetInstance[]
}

export interface Theme {
  id: string
  name: string
  vars: Record<string, string>
}

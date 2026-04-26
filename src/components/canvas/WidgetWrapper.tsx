import { useRef, useState } from 'react'
import type { WidgetInstance } from '../../types/widget'
import { useLayoutStore } from '../../store/layoutStore'

interface Props {
  widget: WidgetInstance
  editMode: boolean
  children: React.ReactNode
}

export function WidgetWrapper({ widget, editMode, children }: Props) {
  const { moveWidget, removeWidget } = useLayoutStore()
  const dragging = useRef(false)
  const startPos = useRef({ mx: 0, my: 0, wx: 0, wy: 0 })
  const [pos, setPos] = useState(widget.position)

  const onPointerDown = (e: React.PointerEvent) => {
    if (!editMode) return
    dragging.current = true
    startPos.current = { mx: e.clientX, my: e.clientY, wx: pos.x, wy: pos.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const nx = startPos.current.wx + e.clientX - startPos.current.mx
    const ny = startPos.current.wy + e.clientY - startPos.current.my
    setPos({ x: nx, y: ny })
  }

  const onPointerUp = () => {
    if (!dragging.current) return
    dragging.current = false
    moveWidget(widget.id, pos)
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: widget.size.w,
        height: widget.size.h,
        zIndex: widget.zIndex,
        cursor: editMode ? 'grab' : 'default',
        padding: 12,
        borderRadius: 16,
        background: editMode ? 'var(--widget-bg)' : 'transparent',
        border: editMode ? '1px solid var(--widget-border)' : 'none',
        backdropFilter: editMode ? 'blur(8px)' : 'none',
        boxShadow: editMode ? 'var(--shadow)' : 'none',
        transition: 'background 0.2s, border 0.2s',
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
      {editMode && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => removeWidget(widget.id)}
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#f87171',
            color: '#fff',
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
          }}
        >✕</button>
      )}
    </div>
  )
}

interface DateConfig {
  showDay?: boolean
  showMonth?: boolean
  showYear?: boolean
  locale?: string
}

interface Props { config: DateConfig }

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function DateWidget({ config }: Props) {
  const { showDay = true, showMonth = true, showYear = false } = config
  const now = new Date()
  const day = DAYS[now.getDay()]
  const month = MONTHS[now.getMonth()]
  const date = now.getDate()
  const year = now.getFullYear()

  return (
    <div className="flex flex-col gap-0.5" style={{ color: 'var(--text-secondary)' }}>
      {showDay && (
        <span className="font-light tracking-widest uppercase text-xs" style={{ color: 'var(--accent)' }}>
          {day}
        </span>
      )}
      <span className="font-light" style={{ fontSize: 'clamp(16px, 3vw, 36px)', color: 'var(--text-primary)' }}>
        {showMonth ? `${month} ` : ''}{date}{showYear ? `, ${year}` : ''}
      </span>
    </div>
  )
}

export default function HBarChart({ data = [], color = '#2563EB', maxItems = 8 }) {
  const rows = data.slice(0, maxItems)
  const max  = Math.max(...rows.map(r => r.value), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px', color: '#6B7280', width: '110px', flexShrink: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }} title={r.name}>
            {r.name}
          </span>
          <div style={{ flex: 1, background: '#F3F4F6', borderRadius: '3px', height: '14px' }}>
            <div style={{
              width: `${(r.value / max) * 100}%`,
              height: '100%',
              background: color,
              borderRadius: '3px',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <span style={{
            fontSize: '11px', fontWeight: 500, color: '#374151',
            width: '32px', textAlign: 'right', flexShrink: 0,
            fontFamily: "'DM Mono', monospace",
          }}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  )
}

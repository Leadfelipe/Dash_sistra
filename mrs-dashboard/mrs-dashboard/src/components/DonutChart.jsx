const COLORS = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#7C3AED', '#0891B2']

function arc(cx, cy, r, startAngle, endAngle) {
  const s = (startAngle * Math.PI) / 180
  const e = (endAngle   * Math.PI) / 180
  const x1 = cx + r * Math.cos(s)
  const y1 = cy + r * Math.sin(s)
  const x2 = cx + r * Math.cos(e)
  const y2 = cy + r * Math.sin(e)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

export default function DonutChart({ data = [], size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let cursor = -90

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        {data.map((d, i) => {
          const sweep = (d.value / total) * 360
          const path  = arc(size/2, size/2, size/2 - 10, cursor, cursor + sweep - 1)
          cursor += sweep
          return (
            <path key={i} d={path} fill="none" stroke={COLORS[i % COLORS.length]}
              strokeWidth={18} strokeLinecap="butt" />
          )
        })}
        <text x={size/2} y={size/2 - 4} textAnchor="middle"
          style={{ fontSize: '15px', fontWeight: 600, fill: '#111827', fontFamily: "'DM Mono', monospace" }}>
          {total}
        </text>
        <text x={size/2} y={size/2 + 12} textAnchor="middle"
          style={{ fontSize: '9px', fill: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>
          total
        </text>
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: '#6B7280', flex: 1 }}>{d.name}</span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#111827', fontFamily: "'DM Mono', monospace" }}>
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

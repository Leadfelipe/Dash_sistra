export default function KpiCard({ label, value, sub, accent = '#2563EB' }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderTop: `3px solid ${accent}`,
      borderRadius: '8px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minWidth: 0,
    }}>
      <span style={{ fontSize: '11px', fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{ fontSize: '28px', fontWeight: 600, color: '#111827', lineHeight: 1, fontFamily: "'DM Mono', monospace" }}>
        {value?.toLocaleString('pt-BR') ?? '—'}
      </span>
      {sub && (
        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{sub}</span>
      )}
    </div>
  )
}

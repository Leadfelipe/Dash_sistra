export default function Widget({ title, children, span = 1 }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '16px',
      gridColumn: `span ${span}`,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <span style={{
        fontSize: '11px', fontWeight: 500, color: '#6B7280',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        borderBottom: '1px solid #F3F4F6', paddingBottom: '8px',
      }}>
        {title}
      </span>
      {children}
    </div>
  )
}

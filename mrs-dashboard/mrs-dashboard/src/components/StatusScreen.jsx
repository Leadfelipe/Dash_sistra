export default function StatusScreen({ token, error, loading }) {
  if (loading) return (
    <div style={center}>
      <div style={spinner} />
      <span style={msg}>Carregando dados do Feature Service…</span>
    </div>
  )

  if (error) return (
    <div style={{ ...center, flexDirection: 'column', gap: '12px' }}>
      <span style={{ fontSize: '32px' }}>⚠</span>
      <span style={{ ...msg, color: '#DC2626' }}>{error}</span>
      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
        Verifique as permissões do Feature Service e o token.
      </span>
    </div>
  )

  if (!token) return (
    <div style={{ ...center, flexDirection: 'column', gap: '8px' }}>
      <div style={spinner} />
      <span style={msg}>Aguardando token do Experience Builder…</span>
      <span style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '8px' }}>
        Dev? Adicione ?token=SEU_TOKEN na URL para testar localmente.
      </span>
    </div>
  )

  return null
}

const center = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  height: '100vh', gap: '12px', flexDirection: 'row',
  background: '#F9FAFB',
}

const msg = {
  fontSize: '14px', color: '#6B7280', fontFamily: "'DM Sans', sans-serif",
}

const spinner = {
  width: '20px', height: '20px', border: '2px solid #E5E7EB',
  borderTop: '2px solid #2563EB', borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}

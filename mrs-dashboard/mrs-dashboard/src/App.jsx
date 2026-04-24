import { useToken }       from './hooks/useToken'
import { useFeatureData } from './hooks/useFeatureData'
import KpiCard      from './components/KpiCard'
import Widget       from './components/Widget'
import HBarChart    from './components/HBarChart'
import DonutChart   from './components/DonutChart'
import SerieChart   from './components/SerieChart'
import StatusScreen from './components/StatusScreen'

const ACCENT = {
  blue:   '#2563EB',
  green:  '#16A34A',
  amber:  '#D97706',
  red:    '#DC2626',
  indigo: '#4F46E5',
}

export default function App() {
  const { token, error: tokenError } = useToken()
  const { data, loading, error: dataError } = useFeatureData(token)

  const shouldShowStatus = !data || loading || dataError || (!token && !data)

  if (shouldShowStatus) {
    return <StatusScreen token={token} error={dataError || tokenError} loading={loading} />
  }

  const pct = (n, total) => total > 0 ? `${Math.round((n / total) * 100)}%` : '—'

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: '#F9FAFB',
      minHeight: '100vh',
      padding: '16px',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>
            MRS — Formulário Padrão 2026
          </h1>
          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
            Lead Gestão Fundiária · leadgf.maps.arcgis.com
          </span>
        </div>
        <div style={{
          fontSize: '10px', background: '#ECFDF5', color: '#065F46',
          padding: '4px 10px', borderRadius: '99px', fontWeight: 500,
        }}>
          ● ao vivo
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '12px' }}>
        <KpiCard label="Total cadastrados"   value={data.kpis.total}
          sub="fichas MRS" accent={ACCENT.blue} />
        <KpiCard label="Ocupados"            value={data.kpis.ocupados}
          sub={pct(data.kpis.ocupados, data.kpis.total) + ' do total'} accent={ACCENT.green} />
        <KpiCard label="Com servidão"        value={data.kpis.servidao}
          sub={pct(data.kpis.servidao, data.kpis.total) + ' do total'} accent={ACCENT.amber} />
        <KpiCard label="Total moradores"     value={data.kpis.moradores}
          sub={`média ${data.kpis.total > 0 ? (data.kpis.moradores / data.kpis.total).toFixed(1) : '—'}/imóvel`} accent={ACCENT.indigo} />
        <KpiCard label="Residências"         value={data.kpis.residencias}
          sub="unidades declaradas" accent={ACCENT.red} />
      </div>

      {/* Grid principal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>

        <Widget title="Tipo de imóvel">
          <DonutChart data={data.byTipo} />
        </Widget>

        <Widget title="Ocupação">
          <DonutChart data={data.byOcupac} />
        </Widget>

        <Widget title="Doença crônica declarada">
          <DonutChart data={data.byCronico} />
        </Widget>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '10px' }}>

        <Widget title="Vistorias por data">
          <SerieChart data={data.bySerie} />
        </Widget>

        <Widget title="Topografia do terreno">
          <HBarChart data={data.byTopografia} color={ACCENT.amber} />
        </Widget>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>

        <Widget title="Produção por vistoriador">
          <HBarChart data={data.byVistoriador} color={ACCENT.indigo} />
        </Widget>

        <Widget title="Top 10 municípios">
          <HBarChart data={data.byMunicipio} color={ACCENT.blue} />
        </Widget>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>

        <Widget title="Faixa etária — 0 a 18 anos">
          <HBarChart data={data.byFaixaA} color="#0891B2" maxItems={6} />
        </Widget>

        <Widget title="Faixa etária — 19 a 59 anos">
          <HBarChart data={data.byFaixaB} color="#0891B2" maxItems={6} />
        </Widget>

        <Widget title="Faixa etária — acima de 60">
          <HBarChart data={data.byFaixaC} color="#0891B2" maxItems={6} />
        </Widget>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

        <Widget title="Aptidão da área total">
          <HBarChart data={data.byAptidao} color={ACCENT.green} />
        </Widget>

        <Widget title="Distribuição por tipo de imóvel">
          <HBarChart data={data.byTipo} color={ACCENT.blue} />
        </Widget>

      </div>

      {/* Footer */}
      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '10px', color: '#D1D5DB' }}>
        MRS Dashboard v1.0 · Item ID: bf82b1393c2d432b9051688f8922aa44
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}

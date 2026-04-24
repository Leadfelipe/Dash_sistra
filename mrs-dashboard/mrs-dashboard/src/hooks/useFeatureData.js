import { useState, useEffect, useCallback } from 'react'

const FS_BASE = 'https://leadgf.maps.arcgis.com/sharing/rest/content/items/bf82b1393c2d432b9051688f8922aa44'
const FS_URL  = 'https://services.arcgis.com' // será resolvido via /data

// Resolve a URL real do Feature Service a partir do itemId
async function resolveServiceUrl(token) {
  const res = await fetch(`${FS_BASE}?f=json&token=${token}`)
  const data = await res.json()
  if (!data.url) throw new Error('Não foi possível resolver a URL do Feature Service.')
  return data.url
}

async function query(serviceUrl, layerId, params, token) {
  const url = `${serviceUrl}/${layerId}/query`
  const body = new URLSearchParams({
    f: 'json',
    token,
    returnGeometry: 'false',
    ...params,
  })
  const res = await fetch(url, { method: 'POST', body })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data
}

export function useFeatureData(token) {
  const [serviceUrl, setServiceUrl] = useState(null)
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // Resolve URL do FS
  useEffect(() => {
    if (!token) return
    resolveServiceUrl(token)
      .then(setServiceUrl)
      .catch(e => setError(e.message))
  }, [token])

  // Carrega todos os dados quando a URL estiver disponível
  const load = useCallback(async () => {
    if (!serviceUrl || !token) return
    setLoading(true)
    setError(null)
    try {
      // Layer 0 — fichas principais
      const [kpis, byTipo, byOcupac, byTopografia, byVistoriador,
             byMunicipio, byCronico, byFaixaA, byFaixaB, byFaixaC,
             bySerie, byAptidao] = await Promise.all([

        // KPIs agregados
        query(serviceUrl, 0, {
          where: '1=1',
          outStatistics: JSON.stringify([
            { statisticType: 'count', onStatisticField: 'objectid',  outStatisticFieldName: 'total' },
            { statisticType: 'sum',   onStatisticField: 'numer',     outStatisticFieldName: 'moradores' },
            { statisticType: 'sum',   onStatisticField: 'q_domicilio', outStatisticFieldName: 'residencias' },
          ]),
        }, token),

        // Tipo imóvel
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'Imovel',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
          orderByFields: 'n DESC',
        }, token),

        // Ocupação
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'ocupac',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
        }, token),

        // Topografia
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'topografia',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
          orderByFields: 'n DESC',
        }, token),

        // Por vistoriador
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'vistoriador',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
          orderByFields: 'n DESC',
        }, token),

        // Por município
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'nome_municipio',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
          orderByFields: 'n DESC',
          resultRecordCount: 10,
        }, token),

        // Crônico
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'cronico',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
        }, token),

        // Faixa etária 0-18
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'ate_18',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
          orderByFields: 'ate_18 ASC',
        }, token),

        // Faixa etária 19-59
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'ate_59',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
          orderByFields: 'ate_59 ASC',
        }, token),

        // Faixa etária 60+
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'acima_60',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
          orderByFields: 'acima_60 ASC',
        }, token),

        // Série temporal por semana
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'datas',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
          orderByFields: 'datas ASC',
        }, token),

        // Aptidão
        query(serviceUrl, 0, {
          where: '1=1',
          groupByFieldsForStatistics: 'aptid_tota',
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
          orderByFields: 'n DESC',
        }, token),
      ])

      // KPIs extras via where clause
      const [ocupados, servidao] = await Promise.all([
        query(serviceUrl, 0, {
          where: "ocupac='Sim'",
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
        }, token),
        query(serviceUrl, 0, {
          where: "servidao='Sim'",
          outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'objectid', outStatisticFieldName: 'n' }]),
        }, token),
      ])

      const feat = a => (a.features || []).map(f => f.attributes)

      setData({
        kpis: {
          total:       feat(kpis)[0]?.total      ?? 0,
          moradores:   feat(kpis)[0]?.moradores   ?? 0,
          residencias: feat(kpis)[0]?.residencias ?? 0,
          ocupados:    feat(ocupados)[0]?.n        ?? 0,
          servidao:    feat(servidao)[0]?.n        ?? 0,
        },
        byTipo:        feat(byTipo).map(r => ({ name: r.Imovel || 'N/I', value: r.n })),
        byOcupac:      feat(byOcupac).map(r => ({ name: r.ocupac || 'N/I', value: r.n })),
        byTopografia:  feat(byTopografia).map(r => ({ name: r.topografia || 'N/I', value: r.n })),
        byVistoriador: feat(byVistoriador).map(r => ({ name: r.vistoriador || 'N/I', value: r.n })),
        byMunicipio:   feat(byMunicipio).map(r => ({ name: r.nome_municipio || 'N/I', value: r.n })),
        byCronico:     feat(byCronico).map(r => ({ name: r.cronico || 'N/I', value: r.n })),
        byFaixaA:      feat(byFaixaA).map(r => ({ name: `${r.ate_18 ?? '?'} pes.`, value: r.n })),
        byFaixaB:      feat(byFaixaB).map(r => ({ name: `${r.ate_59 ?? '?'} pes.`, value: r.n })),
        byFaixaC:      feat(byFaixaC).map(r => ({ name: `${r.acima_60 ?? '?'} pes.`, value: r.n })),
        bySerie:       feat(bySerie).map(r => ({
          name: r.datas ? new Date(r.datas).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '?',
          value: r.n,
        })),
        byAptidao:     feat(byAptidao).map(r => ({ name: r.aptid_tota || 'N/I', value: r.n })),
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [serviceUrl, token])

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: load }
}

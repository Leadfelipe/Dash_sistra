import { useState, useEffect } from 'react'

const PORTAL = 'https://leadgf.maps.arcgis.com'
const ALLOWED_ORIGINS = [
  'https://leadgf.maps.arcgis.com',
  'https://experience.arcgis.com',
  'http://localhost:3000',
  'http://localhost:5173',
]

export function useToken() {
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 1. Tenta pegar token da URL (fallback para dev)
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      setToken(urlToken)
      return
    }

    // 2. Escuta postMessage do Experience Builder
    function handleMessage(event) {
      if (!ALLOWED_ORIGINS.includes(event.origin)) return
      const { type, token: t } = event.data || {}
      if (type === 'MRS_TOKEN' && t) {
        setToken(t)
      }
    }
    window.addEventListener('message', handleMessage)

    // 3. Solicita token ao pai (Experience Builder)
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'MRS_TOKEN_REQUEST' }, '*')
    } else {
      setError('no-parent')
    }

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return { token, error, portal: PORTAL }
}

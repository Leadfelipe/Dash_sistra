// ─────────────────────────────────────────────────────────────────────────────
// SNIPPET — Experience Builder → MRS Dashboard (iframe)
// Cole este código em um widget "Embed" ou "Custom Widget" do Experience Builder
// ─────────────────────────────────────────────────────────────────────────────
//
// OPÇÃO 1 — Widget Embed (HTML simples)
// No Experience Builder, adicione um widget "Embed" e cole o HTML abaixo:
// ─────────────────────────────────────────────────────────────────────────────

const DASHBOARD_URL = 'https://leadfelipe.github.io/mrs-dashboard/'

// HTML a colar no widget Embed:
const embedHTML = `
<iframe
  id="mrs-iframe"
  src="${DASHBOARD_URL}"
  style="width:100%;height:100%;border:none;"
  allow="same-origin"
></iframe>
<script>
  // Aguarda o iframe carregar, depois envia o token
  var iframe = document.getElementById('mrs-iframe')

  // Escuta a solicitação de token vinda do iframe
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'MRS_TOKEN_REQUEST') {
      // Pega o token do IdentityManager do ArcGIS JS API
      require(['esri/identity/IdentityManager'], function(esriId) {
        var creds = esriId.credentials
        var cred  = creds.find(function(c) {
          return c.server.indexOf('leadgf.maps.arcgis.com') > -1
        })
        if (cred && cred.token) {
          iframe.contentWindow.postMessage(
            { type: 'MRS_TOKEN', token: cred.token },
            '${DASHBOARD_URL}'
          )
        }
      })
    }
  })
<\/script>
`

// ─────────────────────────────────────────────────────────────────────────────
// OPÇÃO 2 — Se o Experience Builder usar AMD/require nativo
// Cole diretamente no campo de código do widget Embed avançado:
// ─────────────────────────────────────────────────────────────────────────────

;(function() {
  var IFRAME_ORIGIN = 'https://leadfelipe.github.io'

  window.addEventListener('message', function(event) {
    if (event.origin !== IFRAME_ORIGIN) return
    if (!event.data || event.data.type !== 'MRS_TOKEN_REQUEST') return

    // ArcGIS JS API já está carregado no Experience Builder
    require(['esri/identity/IdentityManager'], function(esriId) {
      var cred = (esriId.credentials || []).find(function(c) {
        return c.server && c.server.indexOf('leadgf.maps.arcgis.com') > -1
      })
      if (!cred) return
      var iframe = document.querySelector('iframe[src*="mrs-dashboard"]')
      if (!iframe) return
      iframe.contentWindow.postMessage(
        { type: 'MRS_TOKEN', token: cred.token },
        IFRAME_ORIGIN
      )
    })
  })
})()

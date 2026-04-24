# MRS Dashboard — Lead Gestão Fundiária

Dashboard React para monitoramento das fichas MRS 2026, embutido no ArcGIS Experience Builder via iframe.

**Feature Service Item ID:** `bf82b1393c2d432b9051688f8922aa44`

---

## Deploy no GitHub Pages

### 1. Clonar / criar o repositório

```bash
git clone https://github.com/leadfelipe/mrs-dashboard.git
cd mrs-dashboard
npm install
```

### 2. Testar localmente

```bash
# Primeiro obtenha um token válido:
# ArcGIS Online > (F12) > Console:
# window.require(['esri/identity/IdentityManager'], id => console.log(id.credentials[0].token))

npm run dev
# Abra: http://localhost:5173/mrs-dashboard/?token=SEU_TOKEN_AQUI
```

### 3. Publicar no GitHub Pages

```bash
npm run deploy
```

A app ficará disponível em:
`https://leadfelipe.github.io/mrs-dashboard/`

---

## Configurar no Experience Builder

### Passo 1 — Adicionar widget Embed

1. No Experience Builder, clique em **Insert** > **Embed**
2. Cole a URL do dashboard: `https://leadfelipe.github.io/mrs-dashboard/`
3. Marque **Allow same-origin** nas configurações do widget

### Passo 2 — Adicionar o snippet de token

No Experience Builder, adicione um widget **Custom HTML** (ou use o campo de código
avançado do widget Embed) e cole o conteúdo do arquivo `experience-builder-snippet.js`.

Isso faz com que, ao carregar a página, o Experience Builder:
1. Escute a mensagem `MRS_TOKEN_REQUEST` vinda do iframe
2. Leia o token do `IdentityManager` (o usuário já está logado)
3. Envie o token de volta via `postMessage`

### Passo 3 — Configurar Content Security Policy (se necessário)

Se o Experience Builder bloquear o iframe, adicione ao cabeçalho do site:
```
Content-Security-Policy: frame-ancestors 'self' https://experience.arcgis.com https://leadgf.maps.arcgis.com
```

Ou configure no `_headers` do GitHub Pages (arquivo na raiz de `/dist`):
```
/index.html
  X-Frame-Options: ALLOW-FROM https://experience.arcgis.com
```

---

## Estrutura do projeto

```
mrs-dashboard/
├── src/
│   ├── hooks/
│   │   ├── useToken.js          # Captura token via postMessage
│   │   └── useFeatureData.js    # Consulta o Feature Service REST
│   ├── components/
│   │   ├── KpiCard.jsx          # Card de indicador
│   │   ├── HBarChart.jsx        # Gráfico de barras horizontal
│   │   ├── DonutChart.jsx       # Gráfico donut (SVG puro)
│   │   ├── SerieChart.jsx       # Série temporal (Recharts)
│   │   ├── Widget.jsx           # Container com título
│   │   └── StatusScreen.jsx     # Loading / erro / sem token
│   ├── App.jsx                  # Layout principal do dashboard
│   └── main.jsx
├── experience-builder-snippet.js  # Snippet para o Experience Builder
├── vite.config.js
└── package.json
```

---

## Campos monitorados

| Campo | Tipo | Widget |
|-------|------|--------|
| `objectid` | count | KPI total |
| `ocupac` | select_one | KPI + Donut |
| `servidao` | select_one | KPI |
| `numer` | decimal sum | KPI moradores |
| `q_domicilio` | decimal sum | KPI residências |
| `Imovel` | select_one | Donut tipo |
| `cronico` | select_one | Donut crônico |
| `topografia` | select_one | HBar |
| `vistoriador` | text | HBar produção |
| `nome_municipio` | text | HBar municípios |
| `ate_18` / `ate_59` / `acima_60` | select_one | HBar faixas |
| `aptid_tota` | select_multiple | HBar aptidão |
| `datas` | date | Série temporal |

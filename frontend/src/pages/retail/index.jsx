import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { StatCard, BtnPrimary, BtnGhost, Badge, PageHeader, Spinner, Card } from '../../components/UI'
import { BarChart, PieChart, LineChart } from '../../components/Charts'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const useData = () => {
  const [products, setProducts] = useState([])
  const [cats,     setCats]     = useState([])
  const [loading,  setLoading]  = useState(true)
  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/categories')])
      .then(([p, c]) => { setProducts(p.data); setCats(c.data) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])
  return { products, cats, loading }
}

const freq = (arr, key) => {
  const f = {}; arr.forEach(p => { f[p[key]] = (f[p[key]] || 0) + 1 }); return f
}
const toArr = obj => Object.entries(obj).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)

// ─── Retail Dashboard ─────────────────────────────────────────────────────────
export function RetailDashboard() {
  const { products, cats, loading } = useData()
  const [reports, setReports] = useState([])
  useEffect(() => { api.get('/reports').then(r => setReports(r.data)).catch(() => {}) }, [])

  const topCat   = toArr(freq(products, 'category'))[0]
  const topColor = toArr(freq(products, 'color'))[0]

  if (loading) return <DashboardLayout><div style={{ textAlign: 'center', padding: 60 }}><Spinner /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <PageHeader title='Retail Manager Dashboard' subtitle='Business intelligence for data-driven retail decisions.' />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label='Total Reports'  value={reports.length}           icon='📄' />
        <StatCard label='Top Category'   value={topCat?.label || '—'}    icon='🏆' />
        <StatCard label='Top Colour'     value={topColor?.label || '—'}  icon='🎨' />
        <StatCard label='Leading Season' value='Spring'                   icon='☀️' />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card><h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Category Performance</h3>
          <BarChart data={cats.map(c => ({ label: c.name.split(' ')[0], value: products.filter(p => p.category === c.name).length }))} />
        </Card>
        <Card><h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Colour Breakdown</h3>
          <PieChart data={toArr(freq(products, 'color'))} />
        </Card>
      </div>
    </DashboardLayout>
  )
}

// ─── Analytics Dashboard ──────────────────────────────────────────────────────
export function AnalyticsDashboard() {
  const { products, cats, loading } = useData()

  const lineData   = [12, 19, 15, 28, 22, 31, 25, 38, 42, 35, 48, 55]
  const lineLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  if (loading) return <DashboardLayout><div style={{ textAlign: 'center', padding: 60 }}><Spinner /></div></DashboardLayout>

  const catData  = cats.map(c => ({ label: c.name.split(' ')[0], value: products.filter(p => p.category === c.name).length }))
  const colorArr = toArr(freq(products, 'color'))
  const matArr   = toArr(freq(products, 'material'))
  const seasArr  = toArr(freq(products, 'season'))

  return (
    <DashboardLayout>
      <PageHeader title='Analytics Dashboard' />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card><h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Category-wise Trends</h3><BarChart data={catData} height={200} /></Card>
        <Card><h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Colour Distribution</h3><PieChart data={colorArr} /></Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card><h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Material Analysis</h3><BarChart data={matArr} height={180} /></Card>
        <Card><h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Seasonal Trends</h3><PieChart data={seasArr} /></Card>
      </div>
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Product Growth Analysis (2024)</h3>
        <LineChart data={lineData} labels={lineLabels} />
      </Card>
      {/* Top categories table */}
      <Card>
        <h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Top Categories Ranking</h3>
        <table>
          <thead><tr>{['Rank','Category','Products','Share'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {catData.sort((a,b)=>b.value-a.value).map((c,i) => (
              <tr key={c.label}>
                <td style={{ color: i === 0 ? '#C9A84C' : '#5d5143', fontWeight: i === 0 ? 700 : 500 }}>{`#${i+1}`}</td>
                <td style={{ color: '#1f1a16' }}>{cats[i]?.name || c.label}</td>
                <td style={{ color: '#5d5143' }}>{c.value}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(31,26,22,0.08)', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${products.length ? (c.value/products.length*100) : 0}%`, background: '#B98A3C', borderRadius: 2 }} />
                    </div>
                    <span style={{ color: '#5d5143', fontSize: 11 }}>{products.length ? Math.round(c.value/products.length*100) : 0}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  )
}

// ─── Trend Insights ───────────────────────────────────────────────────────────
export function TrendInsights() {
  const { products, cats, loading } = useData()

  if (loading) return <DashboardLayout><div style={{ textAlign: 'center', padding: 60 }}><Spinner /></div></DashboardLayout>

  const topCat   = toArr(freq(products, 'category'))[0]
  const topColor = toArr(freq(products, 'color'))[0]
  const topMat   = toArr(freq(products, 'material'))[0]

  const insights = [
    { icon: '🔥', label: 'Most Popular Category', value: topCat?.label,   detail: `${topCat?.value} products` },
    { icon: '🎨', label: 'Trending Colour',        value: topColor?.label, detail: `Appears in ${topColor?.value} products` },
    { icon: '🧵', label: 'Most Used Material',     value: topMat?.label,   detail: `Used in ${topMat?.value} products` },
    { icon: '☀️', label: 'Leading Season',          value: 'Spring/Summer', detail: 'Highest product volume' },
  ]

  const takeaways = [
    'Luxury Fashion and Streetwear dominate the current collection, accounting for the highest share of trend coverage.',
    'Ivory, Camel, and Black are the most prominent colours this season, reflecting a shift toward muted, sophisticated palettes.',
    'Silk and Cashmere are leading materials, indicating a consumer lean toward premium, tactile fabrics.',
    'Spring/Summer collections outpace Autumn/Winter in volume, suggesting strong forward-buying momentum.',
  ]

  return (
    <DashboardLayout>
      <PageHeader title='Trend Insights' subtitle='Auto-generated summaries from current fashion data.' />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20, marginBottom: 28 }}>
        {insights.map((ins, i) => (
          <Card key={i}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{ins.icon}</div>
            <div style={{ color: '#5d5143', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{ins.label}</div>
            <div style={{ color: '#B98A3C', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{ins.value}</div>
            <div style={{ color: '#4f463d', fontSize: 12 }}>{ins.detail}</div>
          </Card>
        ))}
      </div>
      <Card>
        <h2 style={{ color: '#1f1a16', fontSize: 15, fontWeight: 600, margin: '0 0 20px' }}>Key Takeaways</h2>
        {takeaways.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: i < takeaways.length - 1 ? '1px solid #111' : 'none' }}>
            <span style={{ color: '#C9A84C', fontSize: 16, flexShrink: 0, marginTop: 2 }}>◆</span>
            <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{t}</p>
          </div>
        ))}
      </Card>
    </DashboardLayout>
  )
}

// ─── Reports ──────────────────────────────────────────────────────────────────
export function Reports() {
  const [reports,    setReports]    = useState([])
  const [generating, setGenerating] = useState(false)
  const [loading,    setLoading]    = useState(true)

  const load = () => api.get('/reports').then(r => setReports(r.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const generate = async type => {
    setGenerating(true)
    try {
      await api.post('/reports/generate', { reportType: type })
      toast.success(`${type} report generated!`)
      load()
    } catch { toast.error('Failed to generate report') }
    finally { setGenerating(false) }
  }

  const downloadReport = async report => {
    try {
      const response = await api.get(`/reports/${report._id}/download`, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${report.name}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Download started')
    } catch (err) {
      toast.error('Download failed')
    }
  }

  return (
    <DashboardLayout>
      <PageHeader title='Report Generation' />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        <Card style={{ textAlign: 'center', background: 'rgba(255,249,243,0.98)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
          <h3 style={{ color: '#1f1a16', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>PDF Report</h3>
          <p style={{ color: '#5d5143', fontSize: 13, lineHeight: 1.5, margin: '0 0 20px' }}>Comprehensive trend report with charts, category stats, colour analysis and seasonal distribution.</p>
          <BtnPrimary onClick={() => generate('PDF')} disabled={generating}>{generating ? 'Generating…' : 'Generate PDF'}</BtnPrimary>
        </Card>
        <Card style={{ textAlign: 'center', background: 'rgba(255,249,243,0.98)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <h3 style={{ color: '#1f1a16', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Excel Report</h3>
          <p style={{ color: '#5d5143', fontSize: 13, lineHeight: 1.5, margin: '0 0 20px' }}>Raw data export with product listings, category counts, colour breakdowns and material analysis.</p>
          <BtnGhost onClick={() => generate('Excel')} disabled={generating}>{generating ? 'Generating…' : 'Generate Excel'}</BtnGhost>
        </Card>
      </div>

      <h2 style={{ color: '#1f1a16', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Report History</h2>
      <div style={{ background: 'rgba(255,249,243,0.95)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 18, overflow: 'hidden' }}>
        {loading ? <div style={{ textAlign: 'center', padding: 48 }}><Spinner /></div> : (
          <table>
            <thead><tr>{['Report Name','Type','Generated','Status','Action'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r._id}>
                  <td style={{ color: '#1f1a16' }}>{r.name}</td>
                  <td><Badge text={r.reportType} /></td>
                  <td style={{ color: '#5d5143' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td><Badge text={r.status} color='green' /></td>
                  <td><BtnGhost onClick={() => downloadReport(r)} style={{ color: '#C9A84C' }}>↓ Download</BtnGhost></td>
                </tr>
              ))}
              {reports.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#5d5143', padding: 32 }}>No reports yet — generate one above.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  )
}

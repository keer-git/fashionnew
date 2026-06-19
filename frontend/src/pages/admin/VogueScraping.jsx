import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { StatCard, Badge, BtnPrimary, BtnGhost, PageHeader, Spinner } from '../../components/UI'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function VogueScraping() {
  const [products, setProducts] = useState([])
  const [status,   setStatus]   = useState({ totalRecords: 0, lastScraped: null })
  const [loading,  setLoading]  = useState(true)
  const [scraping, setScraping] = useState(false)
  const [progress, setProgress] = useState(0)

  const load = () => Promise.all([
    api.get('/products'),
    api.get('/scraper/status'),
  ]).then(([p, s]) => { setProducts(p.data); setStatus(s.data) }).catch(() => {}).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const startScrape = async () => {
    setScraping(true); setProgress(0)
    // Animate progress while waiting for server
    const iv = setInterval(() => setProgress(p => p < 85 ? p + 5 : p), 500)
    try {
      await api.post('/scraper/run')
      setProgress(100)
      toast.success('Scraping complete!')
      load()
    } catch {
      toast.error('Scraper failed – ensure Python is installed')
      setProgress(0)
    } finally { clearInterval(iv); setScraping(false) }
  }

  const del = async id => {
    await api.delete(`/products/${id}`); toast.success('Deleted'); setProducts(products.filter(p => p._id !== id))
  }

  return (
    <DashboardLayout>
      <PageHeader title='Vogue Data Scraping' subtitle='Collect and manage scraped fashion data'
        action={
          <div style={{ display: 'flex', gap: 10 }}>
            <BtnPrimary onClick={startScrape} disabled={scraping}>{scraping ? 'Scraping...' : '▶ Start Scraping'}</BtnPrimary>
            <BtnGhost onClick={load}>Refresh</BtnGhost>
          </div>
        } />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label='Total Records'    value={products.length} icon='📦' />
        <StatCard label='Last Scraped'     value={status.lastScraped ? new Date(status.lastScraped).toLocaleDateString() : 'Never'} icon='🕐' />
        <StatCard label='Status'           value={scraping ? 'Running' : 'Idle'} icon='⚡' accent={scraping ? '#f59e0b' : '#C9A84C'} />
      </div>

      {scraping && (
        <div style={{ background: 'rgba(255,249,243,0.95)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#5d5143', fontSize: 13 }}>Scraping vogue.com…</span>
            <span style={{ color: '#B98A3C', fontSize: 13 }}>{progress}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(214,197,171,0.4)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#C9A84C', borderRadius: 2, transition: 'width 0.4s' }} />
          </div>
          <div style={{ color: '#7f7365', fontSize: 12, marginTop: 8 }}>Extracting product names, categories, colours, materials…</div>
        </div>
      )}

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><Spinner size={32} /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {products.map(p => (
            <div key={p._id} style={{ background: 'rgba(255,249,243,0.96)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 14px 28px rgba(31,26,22,0.06)'}}>
              <img src={p.imageUrl} alt={p.productName} style={{ width: '100%', height: 160, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              <div style={{ padding: 16 }}>
                <div style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{p.productName}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  <Badge text={p.category} /><Badge text={p.season} />
                </div>
                <div style={{ color: '#5d5143', fontSize: 12, display: 'flex', gap: 14, marginBottom: 12 }}>
                  <span>🎨 {p.color}</span><span>🧵 {p.material}</span>
                </div>
                <BtnGhost onClick={() => del(p._id)} style={{ color: '#dc2626', width: '100%' }}>Delete</BtnGhost>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

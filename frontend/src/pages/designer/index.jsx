import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { StatCard, Badge, BtnPrimary, BtnGhost, PageHeader, SearchBar, Spinner, Card } from '../../components/UI'
import { BarChart, PieChart } from '../../components/Charts'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'

// ─── Designer Dashboard ───────────────────────────────────────────────────────
export function DesignerDashboard() {
  const [products, setProducts] = useState([])
  const [favCount, setFavCount] = useState(0)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/favorites')])
      .then(([p, f]) => { setProducts(p.data); setFavCount(f.data.length) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const latest = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)

  return (
    <DashboardLayout>
      <PageHeader title='Designer Dashboard' subtitle='Explore fashion trends and curate your design inspiration.' />
      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><Spinner /></div> : <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard label='Total Products'    value={products.length} icon='👗' />
          <StatCard label='Saved Designs'     value={favCount}        icon='♥'  />
          <StatCard label='Latest This Month' value={latest.length}   icon='✨' />
          <StatCard label='Categories'        value={6}               icon='🏷' />
        </div>
        <h2 style={{ color: '#1f1a16', fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Latest Arrivals</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {latest.map(p => (
            <div key={p._id} style={{ background: 'rgba(255,249,243,0.96)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 14px 28px rgba(31,26,22,0.06)' }}>
              <img src={p.imageUrl} alt={p.productName} style={{ width: '100%', height: 140, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              <div style={{ padding: 16 }}>
                <div style={{ color: '#1f1a16', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{p.productName}</div>
                <Badge text={p.category} />
              </div>
            </div>
          ))}
        </div>
      </>}
    </DashboardLayout>
  )
}

// ─── Product Explorer ─────────────────────────────────────────────────────────
export function ProductExplorer() {
  const [products,  setProducts]  = useState([])
  const [cats,      setCats]      = useState([])
  const [favIds,    setFavIds]    = useState(new Set())
  const [search,    setSearch]    = useState('')
  const [filters,   setFilters]   = useState({ category: 'All', color: 'All', season: 'All' })
  const [selected,  setSelected]  = useState(null)
  const [loading,   setLoading]   = useState(true)

  const load = async () => {
    const [p, c, f] = await Promise.all([api.get('/products'), api.get('/categories'), api.get('/favorites')])
    setProducts(p.data); setCats(c.data)
    setFavIds(new Set(f.data.map(fav => fav.productId?._id || fav.productId)))
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const toggleFav = async id => {
    if (favIds.has(id)) {
      await api.delete(`/favorites/${id}`); setFavIds(s => { const n = new Set(s); n.delete(id); return n }); toast.success('Removed')
    } else {
      await api.post('/favorites', { productId: id }); setFavIds(s => new Set([...s, id])); toast.success('Saved ♥')
    }
  }

  const colors  = ['All', ...new Set(products.map(p => p.color))]
  const seasons = ['All', ...new Set(products.map(p => p.season))]

  const filtered = products.filter(p =>
    (filters.category === 'All' || p.category === filters.category) &&
    (filters.color    === 'All' || p.color    === filters.color)    &&
    (filters.season   === 'All' || p.season   === filters.season)   &&
    p.productName.toLowerCase().includes(search.toLowerCase())
  )

  const sel = { background: 'rgba(255,249,243,0.98)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 12, padding: '10px 14px', color: '#1f1a16', fontSize: 13 }

  return (
    <DashboardLayout>
      <PageHeader title='Product Explorer' subtitle={`${filtered.length} products found`} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={setSearch} placeholder='Search products…' />
          <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} style={{ background: 'rgba(255,249,243,0.98)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 12, padding: '10px 14px', color: '#1f1a16', fontSize: 13 }}>
            <option>All</option>{cats.map(c => <option key={c._id}>{c.name}</option>)}
          </select>
          <select value={filters.color} onChange={e => setFilters({ ...filters, color: e.target.value })} style={{ background: 'rgba(255,249,243,0.98)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 12, padding: '10px 14px', color: '#1f1a16', fontSize: 13 }}>
            {colors.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filters.season} onChange={e => setFilters({ ...filters, season: e.target.value })} style={{ background: 'rgba(255,249,243,0.98)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 12, padding: '10px 14px', color: '#1f1a16', fontSize: 13 }}>
            {seasons.map(s => <option key={s}>{s}</option>)}
          </select>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><Spinner /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {filtered.map(p => (
            <div key={p._id} style={{ background: 'rgba(255,249,243,0.96)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', boxShadow: '0 14px 28px rgba(31,26,22,0.06)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(214,197,171,0.7)'}>
              <div style={{ position: 'relative' }} onClick={() => setSelected(p)}>
                <img src={p.imageUrl} alt={p.productName} style={{ width: '100%', height: 200, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                <button onClick={ev => { ev.stopPropagation(); toggleFav(p._id) }}
                  style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.92)', border: favIds.has(p._id) ? '1px solid #C9A84C' : '1px solid rgba(145,109,60,0.25)', color: favIds.has(p._id) ? '#C9A84C' : '#555', width: 32, height: 32, borderRadius: '50%', fontSize: 14 }}>♥</button>
              </div>
              <div style={{ padding: 16 }} onClick={() => setSelected(p)}>
                <div style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{p.productName}</div>
                <Badge text={p.category} />
                <div style={{ color: '#5d5143', fontSize: 12, marginTop: 10, display: 'flex', gap: 14 }}>
                  <span>🎨 {p.color}</span><span>🧵 {p.material}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31,26,22,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'rgba(255,249,243,0.98)', border: '1px solid rgba(214,197,171,0.8)', borderRadius: 14, width: '100%', maxWidth: 660, overflow: 'hidden' }} className='fade-in'>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <img src={selected.imageUrl} alt={selected.productName} style={{ width: '100%', height: 380, objectFit: 'cover' }} />
              <div style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ color: '#B98A3C', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{selected.category}</div>
                    <h2 style={{ color: '#1f1a16', fontSize: 22, fontWeight: 700, margin: 0 }}>{selected.productName}</h2>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: '#4f463d', fontSize: 20 }}>✕</button>
                </div>
                <p style={{ color: '#5d5143', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>{selected.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {[['Colour', selected.color], ['Material', selected.material], ['Season', selected.season]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4f463d', fontSize: 13 }}>{k}</span>
                      <span style={{ color: '#7f7365', fontSize: 13 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <BtnPrimary onClick={() => toggleFav(selected._id)} style={{ width: '100%', background: favIds.has(selected._id) ? 'transparent' : '#C9A84C', color: favIds.has(selected._id) ? '#C9A84C' : '#000', border: '1px solid #C9A84C' }}>
                  {favIds.has(selected._id) ? '♥ Saved' : '♡ Save to Favourites'}
                </BtnPrimary>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

// ─── Favourites ───────────────────────────────────────────────────────────────
export function FavoriteDesigns() {
  const [favs, setFavs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => api.get('/favorites').then(r => setFavs(r.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const remove = async id => {
    await api.delete(`/favorites/${id}`); toast.success('Removed'); load()
  }

  const products = favs.map(f => f.productId).filter(Boolean)

  return (
    <DashboardLayout>
      <PageHeader title='Favourite Designs' subtitle={`${products.length} saved designs`} />
      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><Spinner /></div> :
        products.length === 0
          ? <div style={{ textAlign: 'center', padding: '80px 0', color: '#4f463d' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>♡</div>
              <div style={{ fontSize: 16, color: '#1f1a16', fontWeight: 600 }}>No saved designs yet</div>
              <div style={{ fontSize: 13, marginTop: 6, color: '#5d5143' }}>Explore the Product Explorer and save your favourites.</div>
            </div>
          : <div style={{ columns: '3 220px', gap: 18 }}>
              {products.map(p => {
                const fav = favs.find(f => (f.productId?._id || f.productId) === p._id)
                return (
                  <div key={p._id} style={{ background: 'rgba(255,249,243,0.96)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 18, overflow: 'hidden', marginBottom: 16, breakInside: 'avoid', boxShadow: '0 18px 40px rgba(31,26,22,0.07)' }}>
                    <img src={p.imageUrl} alt={p.productName} style={{ width: '100%', display: 'block' }} onError={e => e.target.style.display = 'none'} />
                    <div style={{ padding: 16 }}>
                      <div style={{ color: '#1f1a16', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{p.productName}</div>
                      <div style={{ color: '#5d5143', fontSize: 13, marginBottom: 12 }}>{p.category}</div>
                      <BtnGhost onClick={() => remove(p._id)} style={{ color: '#b33939', width: '100%' }}>Remove</BtnGhost>
                    </div>
                  </div>
                )
              })}
            </div>
      }
    </DashboardLayout>
  )
}

// ─── Trend Overview ───────────────────────────────────────────────────────────
export function TrendOverview() {
  const [products, setProducts]  = useState([])
  const [cats,     setCats]      = useState([])
  const [loading,  setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/categories')])
      .then(([p, c]) => { setProducts(p.data); setCats(c.data) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const catData    = cats.map(c => ({ label: c.name.split(' ')[0], value: products.filter(p => p.category === c.name).length }))
  const colorFreq  = {}; products.forEach(p => { colorFreq[p.color]    = (colorFreq[p.color]    || 0) + 1 })
  const matFreq    = {}; products.forEach(p => { matFreq[p.material]   = (matFreq[p.material]   || 0) + 1 })
  const seasonFreq = {}; products.forEach(p => { seasonFreq[p.season]  = (seasonFreq[p.season]  || 0) + 1 })

  const toArr = obj => Object.entries(obj).map(([label, value]) => ({ label, value }))

  if (loading) return <DashboardLayout><div style={{ textAlign: 'center', padding: 60 }}><Spinner /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <PageHeader title='Trend Overview' />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label='Total Products'   value={products.length} icon='👗' />
        <StatCard label='Active Seasons'   value={Object.keys(seasonFreq).length} icon='🗓' />
        <StatCard label='Colour Palette'   value={Object.keys(colorFreq).length} icon='🎨' />
        <StatCard label='Materials Used'   value={Object.keys(matFreq).length} icon='🧵' />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card><h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Category Trends</h3><BarChart data={catData} /></Card>
        <Card><h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Seasonal Distribution</h3><PieChart data={toArr(seasonFreq)} /></Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card><h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Colour Palette</h3><PieChart data={toArr(colorFreq)} /></Card>
        <Card><h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Material Analysis</h3><BarChart data={toArr(matFreq)} /></Card>
      </div>
    </DashboardLayout>
  )
}

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { BtnPrimary, BtnGhost, Modal, FormField, PageHeader, SearchBar, Spinner } from '../../components/UI'
import api from '../../utils/api'
import toast from 'react-hot-toast'

// ─── Categories ───────────────────────────────────────────────────────────────
export function CategoryManagement() {
  const [cats,    setCats]    = useState([])
  const [search,  setSearch]  = useState('')
  const [modal,   setModal]   = useState(null)
  const [form,    setForm]    = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)

  const load = () => api.get('/categories').then(r => setCats(r.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const save = async () => {
    try {
      if (modal === 'add') { await api.post('/categories', form); toast.success('Category added') }
      else { await api.put(`/categories/${modal._id}`, form); toast.success('Category updated') }
      setModal(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const filtered = cats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <PageHeader title='Category Management'
        action={<BtnPrimary onClick={() => { setForm({ name: '', description: '' }); setModal('add') }}>+ Add Category</BtnPrimary>} />
      <SearchBar value={search} onChange={setSearch} placeholder='Search categories…' />
      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><Spinner /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
          {filtered.map(c => (
            <div key={c._id} style={{ background: 'rgba(255,249,243,0.96)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 22, padding: 24, boxShadow: '0 18px 40px rgba(31,26,22,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ color: '#1f1a16', fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                <div style={{ color: '#B98A3C', fontSize: 10, background: 'rgba(185,138,60,0.14)', padding: '4px 10px', borderRadius: 999 }}>Active</div>
              </div>
              <p style={{ color: '#4f463d', fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>{c.description}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <BtnGhost onClick={() => { setForm({ name: c.name, description: c.description }); setModal(c) }} style={{ flex: 1 }}>Edit</BtnGhost>
                <BtnGhost onClick={async () => { await api.delete(`/categories/${c._id}`); toast.success('Deleted'); load() }} style={{ flex: 1, color: '#b33939' }}>Delete</BtnGhost>
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Add Category' : 'Edit Category'} onClose={() => setModal(null)}>
          <FormField label='Name'><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label='Description'><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></FormField>
          <div style={{ display: 'flex', gap: 12 }}>
            <BtnPrimary onClick={save} style={{ flex: 1 }}>Save</BtnPrimary>
            <BtnGhost onClick={() => setModal(null)} style={{ flex: 1 }}>Cancel</BtnGhost>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}

// ─── Products ─────────────────────────────────────────────────────────────────
const EMPTY_P = { productName: '', category: '', color: '', material: '', season: 'Spring/Summer', description: '', imageUrl: '' }

export function ProductManagement() {
  const [products, setProducts] = useState([])
  const [cats,     setCats]     = useState([])
  const [search,   setSearch]   = useState('')
  const [filterCat,setFilter]   = useState('All')
  const [modal,    setModal]    = useState(null)
  const [form,     setForm]     = useState(EMPTY_P)
  const [loading,  setLoading]  = useState(true)

  const load = () => Promise.all([api.get('/products'), api.get('/categories')])
    .then(([p, c]) => { setProducts(p.data); setCats(c.data) }).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const save = async () => {
    try {
      if (modal === 'add') { await api.post('/products', form); toast.success('Product added') }
      else { await api.put(`/products/${modal._id}`, form); toast.success('Product updated') }
      setModal(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const filtered = products.filter(p =>
    (filterCat === 'All' || p.category === filterCat) &&
    p.productName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <PageHeader title='Product Management'
        action={<BtnPrimary onClick={() => { setForm({ ...EMPTY_P, category: cats[0]?.name || '' }); setModal('add') }}>+ Add Product</BtnPrimary>} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={setSearch} placeholder='Search products…' />
        <select value={filterCat} onChange={e => setFilter(e.target.value)}
          style={{ background: 'rgba(255,249,243,0.98)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 12, padding: '10px 14px', color: '#1f1a16', minWidth: 160 }}>
          <option>All</option>
          {cats.map(c => <option key={c._id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><Spinner /></div> : (
        <div style={{ background: 'rgba(255,249,243,0.95)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 18px 40px rgba(31,26,22,0.08)' }}>
          <table>
            <thead><tr>{['Image','Product','Category','Color','Material','Season','Actions'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td><img src={p.imageUrl} alt='' style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.style.display='none'} /></td>
                  <td style={{ color: '#1f1a16', maxWidth: 180 }}>{p.productName}</td>
                  <td style={{ color: '#5d5143' }}>{p.category}</td>
                  <td style={{ color: '#5d5143' }}>{p.color}</td>
                  <td style={{ color: '#5d5143' }}>{p.material}</td>
                  <td style={{ color: '#5d5143' }}>{p.season}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <BtnGhost onClick={() => { setForm({ productName: p.productName, category: p.category, color: p.color, material: p.material, season: p.season, description: p.description, imageUrl: p.imageUrl }); setModal(p) }}>Edit</BtnGhost>
                      <BtnGhost onClick={async () => { await api.delete(`/products/${p._id}`); toast.success('Deleted'); load() }} style={{ color: '#b33939' }}>Del</BtnGhost>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Product' : 'Edit Product'} onClose={() => setModal(null)}>
          {[['productName','Product Name'],['color','Color'],['material','Material'],['imageUrl','Image URL']].map(([k,l]) => (
            <FormField key={k} label={l}><input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} /></FormField>
          ))}
          <FormField label='Category'>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {cats.map(c => <option key={c._id}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label='Season'>
            <select value={form.season} onChange={e => setForm({ ...form, season: e.target.value })}>
              {['Spring/Summer','Autumn/Winter','All Season'].map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label='Description'><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></FormField>
          <div style={{ display: 'flex', gap: 12 }}>
            <BtnPrimary onClick={save} style={{ flex: 1 }}>Save</BtnPrimary>
            <BtnGhost onClick={() => setModal(null)} style={{ flex: 1 }}>Cancel</BtnGhost>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}

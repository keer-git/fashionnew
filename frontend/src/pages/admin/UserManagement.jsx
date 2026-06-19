import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { Badge, Spinner, Modal, FormField, BtnPrimary, BtnGhost, PageHeader, SearchBar } from '../../components/UI'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const EMPTY = { name: '', email: '', password: '', role: 'designer', status: 'active' }

export default function UserManagement() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [modal,   setModal]   = useState(null) // null | 'add' | user object
  const [form,    setForm]    = useState(EMPTY)
  const [saving,  setSaving]  = useState(false)

  const load = () => api.get('/users', { params: { search } }).then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [search])

  const openAdd  = () => { setForm(EMPTY); setModal('add') }
  const openEdit = u  => { setForm({ name: u.name, email: u.email, password: '', role: u.role, status: u.status }); setModal(u) }

  const save = async () => {
    setSaving(true)
    try {
      if (modal === 'add') {
        await api.post('/users', form); toast.success('User added')
      } else {
        const { password, ...rest } = form
        await api.put(`/users/${modal._id}`, password ? form : rest); toast.success('User updated')
      }
      setModal(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const del = async id => {
    if (!confirm('Delete this user?')) return
    await api.delete(`/users/${id}`); toast.success('User deleted'); load()
  }

  const toggle = async id => {
    await api.patch(`/users/${id}/toggle-status`); toast.success('Status updated'); load()
  }

  return (
    <DashboardLayout>
      <PageHeader title='User Management' subtitle='Add, edit and manage platform users'
        action={<BtnPrimary onClick={openAdd}>+ Add User</BtnPrimary>} />

      <SearchBar value={search} onChange={setSearch} placeholder='Search by name or email...' />

      <div style={{ marginTop: 20, background: 'rgba(255,249,243,0.95)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}><Spinner /></div> : (
          <table>
            <thead><tr>
              {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{u.name.charAt(0)}</div>
                      <span style={{ color: '#1f1a16' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#5d5143' }}>{u.email}</td>
                  <td><Badge text={u.role} /></td>
                  <td><Badge text={u.status} color={u.status === 'active' ? 'green' : 'red'} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <BtnGhost onClick={() => openEdit(u)}>Edit</BtnGhost>
                      <BtnGhost onClick={() => toggle(u._id)}>Toggle</BtnGhost>
                      <BtnGhost onClick={() => del(u._id)} style={{ color: '#dc2626' }}>Delete</BtnGhost>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add New User' : 'Edit User'} onClose={() => setModal(null)}>
          {['name', 'email'].map(f => (
            <FormField key={f} label={f}>
              <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
            </FormField>
          ))}
          <FormField label='Role'>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              {['admin', 'designer', 'retail'].map(r => <option key={r}>{r}</option>)}
            </select>
          </FormField>
          <FormField label='Status'>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </FormField>
          <FormField label={modal === 'add' ? 'Password' : 'New Password (leave blank to keep)'}>
            <input type='password' value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </FormField>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <BtnPrimary onClick={save} disabled={saving} style={{ flex: 1 }}>{saving ? 'Saving...' : 'Save'}</BtnPrimary>
            <BtnGhost onClick={() => setModal(null)} style={{ flex: 1 }}>Cancel</BtnGhost>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}

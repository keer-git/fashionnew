import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { StatCard, Card, PageHeader } from '../../components/UI'
import { BarChart, PieChart } from '../../components/Charts'
import { Spinner } from '../../components/UI'
import api from '../../utils/api'

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/products'),
      api.get('/categories'),
      api.get('/reports'),
    ]).then(([u, p, c, r]) => {
      setStats({ users: u.data, products: p.data, categories: c.data, reports: r.data })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner size={36} /></div></DashboardLayout>

  const catData   = stats?.categories?.map(c => ({ label: c.name.split(' ')[0], value: stats.products.filter(p => p.category === c.name).length })) || []
  const roleData  = [
    { label: 'Admin',    value: stats?.users?.filter(u => u.role === 'admin').length    || 0 },
    { label: 'Designer', value: stats?.users?.filter(u => u.role === 'designer').length || 0 },
    { label: 'Retail',   value: stats?.users?.filter(u => u.role === 'retail').length   || 0 },
  ]

  return (
    <DashboardLayout>
      <PageHeader title='Admin Dashboard' subtitle='Platform overview and key metrics' />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label='Total Users'      value={stats?.users?.length     || 0} icon='👥' />
        <StatCard label='Fashion Products' value={stats?.products?.length  || 0} icon='👗' />
        <StatCard label='Categories'       value={stats?.categories?.length|| 0} icon='🏷' />
        <StatCard label='Reports'          value={stats?.reports?.length   || 0} icon='📄' />
        <StatCard label='Scraped Records'  value={stats?.products?.filter(p => p.source === 'scraped').length || 0} icon='🔄' />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Products by Category</h3>
          <BarChart data={catData} />
        </Card>
        <Card>
          <h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Users by Role</h3>
          <PieChart data={roleData} />
        </Card>
      </div>
    </DashboardLayout>
  )
}

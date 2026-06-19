import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #f9f2e7 0%, #f5eadf 100%)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', minWidth: 0 }} className='fade-in'>
        {children}
      </main>
    </div>
  )
}

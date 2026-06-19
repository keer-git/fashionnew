import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = {
  admin: [
    { path: '/admin',            icon: '⬛', label: 'Dashboard'       },
    { path: '/admin/users',      icon: '👤', label: 'User Management'  },
    { path: '/admin/scraping',   icon: '🔄', label: 'Vogue Scraping'   },
    { path: '/admin/categories', icon: '🏷', label: 'Categories'       },
    { path: '/admin/products',   icon: '👗', label: 'Products'         },
  ],
  designer: [
    { path: '/designer',           icon: '⬛', label: 'Dashboard'        },
    { path: '/designer/explorer',  icon: '🔍', label: 'Product Explorer'  },
    { path: '/designer/favorites', icon: '♥',  label: 'Favourite Designs' },
    { path: '/designer/trends',    icon: '📈', label: 'Trend Overview'    },
  ],
  retail: [
    { path: '/retail',            icon: '⬛', label: 'Dashboard'     },
    { path: '/retail/analytics',  icon: '📊', label: 'Analytics'     },
    { path: '/retail/insights',   icon: '💡', label: 'Trend Insights' },
    { path: '/retail/reports',    icon: '📄', label: 'Reports'        },
  ],
}

const ROLE_LABEL = { admin: 'Administrator', designer: 'Fashion Designer', retail: 'Retail Manager' }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const nav = NAV[user?.role] || []

  return (
    <aside style={{
      width: collapsed ? 64 : 240, minHeight: '100vh', background: 'linear-gradient(180deg, rgba(249,242,231,0.95), rgba(245,234,223,0.98))',
      borderRight: '1px solid rgba(214,197,171,0.8)', display: 'flex', flexDirection: 'column',
      flexShrink: 0, transition: 'width 0.3s ease', position: 'sticky', top: 0, height: '100vh'
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '24px 16px' : '24px 22px', borderBottom: '1px solid rgba(214,197,171,0.8)' }}>
        {collapsed
          ? <div style={{ color: '#B98A3C', fontWeight: 700, fontSize: 15, textAlign: 'center' }}>VV</div>
          : <>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, lineHeight: 1.1 }}>
                <span style={{ color: '#B98A3C', fontWeight: 600, letterSpacing: '0.1em' }}>VOGUE</span>
                <span style={{ color: '#1f1a16', fontWeight: 300, letterSpacing: '0.1em' }}>VISION</span>
              </div>
              <div style={{ color: '#4f463d', fontSize: 9, letterSpacing: '0.25em', marginTop: 3 }}>FASHION ANALYTICS</div>
            </>
        }
      </div>

      {/* User info */}
      {!collapsed && (
        <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(214,197,171,0.7)' }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            {user?.name?.charAt(0)}
          </div>
          <div style={{ color: '#1f1a16', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
          <div style={{ color: '#5d5143', fontSize: 11, marginTop: 2 }}>{ROLE_LABEL[user?.role]}</div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: collapsed ? '14px 8px' : '14px 10px', overflowY: 'auto' }}>
        {nav.map(item => {
          const active = location.pathname === item.path
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px 14px' : '10px 12px', borderRadius: 6, border: 'none',
                background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                color: active ? '#C9A84C' : '#555', cursor: 'pointer', fontSize: 13,
                fontWeight: active ? 600 : 400, marginBottom: 2, textAlign: 'left',
                borderLeft: active ? '2px solid #C9A84C' : '2px solid transparent',
                transition: 'all 0.15s'
              }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: collapsed ? '12px 8px' : '12px 10px', borderTop: '1px solid rgba(214,197,171,0.7)' }}>
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid rgba(145,109,60,0.24)', background: 'rgba(255,249,243,0.9)', color: '#5d5143', fontSize: 12, marginBottom: 8, cursor: 'pointer' }}>
          {collapsed ? '→' : '← Collapse'}
        </button>
        <button onClick={logout}
          style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid rgba(145,109,60,0.24)', background: 'rgba(255,249,243,0.9)', color: '#5d5143', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
          <span>⏻</span>{!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}

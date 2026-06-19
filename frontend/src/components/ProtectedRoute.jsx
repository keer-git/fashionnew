import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from './UI'

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f9f2e7 0%, #f5eadf 100%)' }}>
      <Spinner size={36} />
    </div>
  )

  if (!user) return <Navigate to='/login' replace />
  if (roles.length && !roles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />

  return children
}

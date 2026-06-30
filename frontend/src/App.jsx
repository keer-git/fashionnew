import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login   from './pages/Login'
import { Register, ForgotPassword } from './pages/Register'

import AdminDashboard  from './pages/admin/Dashboard'
import UserManagement  from './pages/admin/UserManagement'
import VogueScraping   from './pages/admin/VogueScraping'
import { CategoryManagement, ProductManagement } from './pages/admin/Categories'

import { DesignerDashboard, ProductExplorer, FavoriteDesigns, TrendOverview } from './pages/designer/index'
import { RetailDashboard, AnalyticsDashboard, TrendInsights, Reports } from './pages/retail/index'
import ColorPalette from './pages/designer/ColorPalette'

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to='/login' replace />
  return <Navigate to={`/${user.role}`} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position='bottom-right'
        toastOptions={{
          style: { background: 'rgba(255,249,243,0.98)', color: '#1f1a16', border: '1px solid rgba(214,197,171,0.9)', fontSize: 13 },
          success: { iconTheme: { primary: '#B98A3C', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path='/'               element={<Landing />} />
        <Route path='/login'          element={<Login />} />
        <Route path='/register'       element={<Register />} />
        <Route path='/forgot-password'element={<ForgotPassword />} />
        <Route path='/dashboard'      element={<RoleRedirect />} />

        {/* Admin */}
        <Route path='/admin' element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path='/admin/users'      element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
        <Route path='/admin/scraping'   element={<ProtectedRoute roles={['admin']}><VogueScraping /></ProtectedRoute>} />
        <Route path='/admin/categories' element={<ProtectedRoute roles={['admin']}><CategoryManagement /></ProtectedRoute>} />
        <Route path='/admin/products'   element={<ProtectedRoute roles={['admin']}><ProductManagement /></ProtectedRoute>} />

        {/* Designer */}
        <Route path='/designer'           element={<ProtectedRoute roles={['designer']}><DesignerDashboard /></ProtectedRoute>} />
        <Route path='/designer/explorer'  element={<ProtectedRoute roles={['designer']}><ProductExplorer /></ProtectedRoute>} />
        <Route path='/designer/favorites' element={<ProtectedRoute roles={['designer']}><FavoriteDesigns /></ProtectedRoute>} />
        <Route path='/designer/trends'    element={<ProtectedRoute roles={['designer']}><TrendOverview /></ProtectedRoute>} />
        <Route path='/designer/color-palette'   element={<ProtectedRoute roles={['designer']}><ColorPalette /></ProtectedRoute>} />
        {/* Retail */}
        <Route path='/retail'           element={<ProtectedRoute roles={['retail']}><RetailDashboard /></ProtectedRoute>} />
        <Route path='/retail/analytics' element={<ProtectedRoute roles={['retail']}><AnalyticsDashboard /></ProtectedRoute>} />
        <Route path='/retail/insights'  element={<ProtectedRoute roles={['retail']}><TrendInsights /></ProtectedRoute>} />
        <Route path='/retail/reports'   element={<ProtectedRoute roles={['retail']}><Reports /></ProtectedRoute>} />

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </AuthProvider>
  )
}

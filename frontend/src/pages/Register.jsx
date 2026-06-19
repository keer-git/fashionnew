import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import api from '../utils/api'

const inp = { background: '#fff8f1', border: '1px solid rgba(214,197,171,0.9)', borderRadius: 12, padding: '12px 15px', color: '#1f1a16', fontSize: 14, width: '100%' }
const lbl = { color: '#4f463d', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, display: 'block' }

const AuthShell = ({ title, children }) => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f9f2e7 0%, #f5eadf 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Link to='/login' style={{ color: '#7f7365', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 28 }}>← Back to Sign In</Link>
      <div style={{ background: 'rgba(255,249,243,0.98)', border: '1px solid rgba(214,197,171,0.9)', borderRadius: 20, padding: '42px 36px', boxShadow: '0 20px 50px rgba(31,26,22,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, marginBottom: 6 }}>
            <span style={{ color: '#B98A3C', fontWeight: 600, letterSpacing: '0.1em' }}>VOGUE</span>
            <span style={{ color: '#1f1a16', fontWeight: 300, letterSpacing: '0.1em' }}>VISION</span>
          </div>
          <div style={{ color: '#4f463d', fontSize: 13 }}>{title}</div>
        </div>
        {children}
      </div>
    </div>
  </div>
)

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'designer' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      const user = await login(form.email, form.password)
      toast.success('Account created!')
      navigate(`/${user.role}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <AuthShell title='Create a new account'>
      <form onSubmit={handleSubmit}>
        {['name', 'email'].map(f => (
          <div key={f} style={{ marginBottom: 14 }}>
            <label style={lbl}>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
            <input style={inp} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} required />
          </div>
        ))}
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Role</label>
          <select style={inp} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value='designer'>Fashion Designer</option>
            <option value='retail'>Retail Manager</option>
          </select>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Password</label>
          <input style={inp} type='password' value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
        </div>
        <button type='submit' disabled={loading}
          style={{ width: '100%', background: '#C9A84C', color: '#000', border: 'none', padding: 13, borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Creating...' : 'CREATE ACCOUNT'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#444' }}>
        Already have an account? <Link to='/login' style={{ color: '#C9A84C', textDecoration: 'none' }}>Sign in</Link>
      </div>
    </AuthShell>
  )
}

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)

  const handleSubmit = e => { e.preventDefault(); setSent(true); toast.success('Reset link sent!') }

  return (
    <AuthShell title='Reset your password'>
      {sent
        ? <div style={{ textAlign: 'center', color: '#888', padding: '20px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✉️</div>
            <div>Check your email for a reset link.</div>
          </div>
        : <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={lbl}>Email Address</label>
              <input style={inp} type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='your@email.com' required />
            </div>
            <button type='submit' style={{ width: '100%', background: '#C9A84C', color: '#000', border: 'none', padding: 13, borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              SEND RESET LINK
            </button>
          </form>
      }
    </AuthShell>
  )
}

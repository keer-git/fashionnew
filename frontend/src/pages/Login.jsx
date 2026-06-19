import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const DEMO = [
    { name: 'Alexandra Stone (Admin)',    email: 'admin@voguevision.com',    pass: 'admin123'  },
    { name: 'Isabella Reeves (Designer)', email: 'designer@voguevision.com', pass: 'design123' },
    { name: 'Marcus Cole (Retail)',       email: 'retail@voguevision.com',   pass: 'retail123' },
  ]

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(email, password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(`/${user.role}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  const inp = { background: '#fff8f1', border: '1px solid rgba(214,197,171,0.9)', borderRadius: 12, padding: '12px 15px', color: '#1f1a16', fontSize: 14, width: '100%' }
  const lbl = { color: '#4f463d', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, display: 'block' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f9f2e7 0%, #f5eadf 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Link to='/' style={{ color: '#7f7365', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 28 }}>← Back to Home</Link>
        <div style={{ background: 'rgba(255,249,243,0.98)', border: '1px solid rgba(214,197,171,0.9)', borderRadius: 20, padding: '42px 36px', boxShadow: '0 20px 50px rgba(31,26,22,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, marginBottom: 6 }}>
              <span style={{ color: '#B98A3C', fontWeight: 600, letterSpacing: '0.1em' }}>VOGUE</span>
              <span style={{ color: '#1f1a16', fontWeight: 300, letterSpacing: '0.1em' }}>VISION</span>
            </div>
            <div style={{ color: '#4f463d', fontSize: 13 }}>Sign in to your account</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={lbl}>Email</label>
              <input style={inp} type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='your@email.com' required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={lbl}>Password</label>
              <input style={inp} type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='••••••••' required />
            </div>
            <button type='submit' disabled={loading}
              style={{ width: '100%', background: loading ? '#8B6914' : '#C9A84C', color: '#000', border: 'none', padding: 13, borderRadius: 6, fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 12, color: '#444' }}>
            <Link to='/forgot-password' style={{ color: '#C9A84C', textDecoration: 'none' }}>Forgot password?</Link>
            <Link to='/register' style={{ color: '#C9A84C', textDecoration: 'none' }}>Create account</Link>
          </div>

          {/* Demo credentials */}
          <div style={{ marginTop: 28, borderTop: '1px solid rgba(214,197,171,0.8)', paddingTop: 20 }}>
            <div style={{ color: '#7f7365', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>Demo Credentials</div>
            {DEMO.map(d => (
              <button key={d.email} onClick={() => { setEmail(d.email); setPassword(d.pass) }}
                style={{ width: '100%', background: 'rgba(255,249,243,0.95)', border: '1px solid rgba(214,197,171,0.9)', borderRadius: 12, padding: '10px 14px', marginBottom: 6, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#7f7365', fontSize: 12 }}>{d.name}</span>
                <span style={{ color: '#5f5345', fontSize: 11 }}>{d.pass}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

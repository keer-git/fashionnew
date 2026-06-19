import { useNavigate } from 'react-router-dom'
import { GoldDivider } from '../components/UI'

const features = [
  { icon: '🔄', title: 'Automated Data Collection',  desc: 'Scrapes Vogue Magazine automatically to keep your trend data current without manual effort.' },
  { icon: '📊', title: 'Fashion Analytics',          desc: 'Powerful visualisations for colour, material, category and seasonal trend analysis.' },
  { icon: '✏️',  title: 'Designer Dashboard',         desc: 'Dedicated workspace for fashion designers to explore and bookmark trend-setting looks.' },
  { icon: '🏪', title: 'Retail Manager Tools',       desc: 'Business intelligence reports and insights tailored for retail decision-making.' },
  { icon: '📄', title: 'Report Generation',          desc: 'Export PDF and Excel reports on trend data for presentations and planning sessions.' },
]

const benefits = [
  'Automated Vogue data collection',
  'Role-based access for designers & retailers',
  'Interactive analytics dashboards',
  'PDF & Excel report exports',
  'Real-time trend monitoring',
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'linear-gradient(180deg, #f9f2e7 0%, #f5eadf 100%)', minHeight: '100vh', color: '#1f1a16', fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', borderBottom: '1px solid rgba(214,197,171,0.7)', position: 'sticky', top: 0, background: 'rgba(255,249,243,0.98)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22 }}>
          <span style={{ color: '#C9A84C', fontWeight: 600, letterSpacing: '0.1em' }}>VOGUE</span>
          <span style={{ color: '#151111f4', fontWeight: 300, letterSpacing: '0.1em' }}>VISION</span>
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: 13, color: '#666' }}>
          {['Features', 'About', 'Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: '#666', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#C9A84C'} onMouseLeave={e => e.target.style.color = '#666'}>{l}</a>
          ))}
        </div>
        <button onClick={() => navigate('/login')} style={{ background: '#C9A84C', color: '#000', border: 'none', padding: '10px 24px', borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer' }}>
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '120px 60px 80px' }}>
        <div style={{ color: '#B98A3C', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 24 }}>Fashion Intelligence Platform</div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: 700, lineHeight: 1.05, margin: '0 0 6px', letterSpacing: '-0.02em', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Transforming Fashion Data
        </h1>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: 300, lineHeight: 1.05, margin: '0 0 32px', color: '#B98A3C', letterSpacing: '-0.02em', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          into Trend Insights
        </h1>
        <p style={{ color: '#4f463d', fontSize: 16, maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.7 }}>
          VogueVision automates fashion trend discovery by collecting and analysing data from Vogue Magazine, delivering actionable insights for designers and retail professionals.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ background: '#B98A3C', color: '#1f1a16', border: 'none', padding: '14px 40px', borderRadius: 14, fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', boxShadow: '0 12px 24px rgba(185,138,60,0.18)' }}>GET STARTED</button>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#4f463d', border: '1px solid rgba(31,26,22,0.12)', padding: '14px 32px', borderRadius: 14, fontSize: 14, cursor: 'pointer' }}>View Demo</button>
        </div>
        <div style={{ marginTop: 80, display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
          {[['2,400+', 'PRODUCTS'], ['6', 'CATEGORIES'], ['3', 'USER ROLES']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ color: '#C9A84C', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>{n}</div>
              <div style={{ color: '#333', fontSize: 11, letterSpacing: '0.12em' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* Features */}
      <section id='features' style={{ padding: '80px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>Platform Capabilities</div>
          <h2 style={{ fontSize: 36, fontWeight: 600 }}>Everything You Need</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,249,243,0.95)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 18, padding: '28px 26px', transition: 'border-color 0.2s', boxShadow: '0 20px 40px rgba(31,26,22,0.08)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(185,138,60,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(214,197,171,0.7)'}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ color: '#1f1a16', fontSize: 14, fontWeight: 600, margin: '0 0 10px' }}>{f.title}</h3>
              <p style={{ color: '#4f463d', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id='about' style={{ padding: '80px 60px', background: 'rgba(255,249,243,0.98)', borderTop: '1px solid rgba(214,197,171,0.7)', borderBottom: '1px solid rgba(214,197,171,0.7)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ color: '#C9A84C', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>About VogueVision</div>
            <h2 style={{ fontSize: 32, fontWeight: 600, margin: '0 0 20px', lineHeight: 1.2 }}>Fashion Intelligence for the Modern Industry</h2>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>Manual fashion trend analysis is slow, resource-intensive, and prone to human error. VogueVision eliminates these inefficiencies through intelligent automation.</p>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.8 }}>By aggregating and analysing data from Vogue Magazine's digital archives, we provide fashion professionals with the insights they need to make confident, data-driven decisions.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#999', fontSize: 14 }}>
                <span style={{ color: '#C9A84C', fontSize: 16, flexShrink: 0 }}>✓</span>{b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id='contact' style={{ padding: '80px 60px', textAlign: 'center' }}>
        <div style={{ color: '#B98A3C', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>Contact</div>
        <h2 style={{ fontSize: 32, fontWeight: 600, margin: '0 0 12px' }}>Get In Touch</h2>
        <p style={{ color: '#4f463d', fontSize: 14, marginBottom: 36 }}>Questions about VogueVision? We'd love to hear from you.</p>
        <div style={{ display: 'flex', gap: 12, maxWidth: 440, margin: '0 auto' }}>
          <input placeholder='Your email address' style={{ flex: 1, background: '#fff8f1', border: '1px solid rgba(214,197,171,0.9)', borderRadius: 12, padding: '12px 16px', color: '#1f1a16', fontSize: 14 }} />
          <button style={{ background: '#B98A3C', color: '#1f1a16', border: 'none', padding: '12px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Send</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #111', padding: '36px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ color: '#C9A84C', fontWeight: 700, letterSpacing: '0.1em' }}>VOGUE</span>
          <span style={{ color: '#333', fontWeight: 300, letterSpacing: '0.1em' }}>VISION</span>
          <div style={{ color: '#333', fontSize: 11, marginTop: 4 }}>Transforming Fashion Data into Trend Insights</div>
        </div>
        <div style={{ color: '#333', fontSize: 12 }}>© 2024 VogueVision — Academic Project</div>
      </footer>
    </div>
  )
}

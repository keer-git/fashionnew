// ─── Shared reusable components ───────────────────────────────────────────────

export const Badge = ({ text, color = 'gold' }) => {
  const colors = {
    gold:   { bg: 'rgba(185,138,60,0.16)', text: '#B98A3C', border: 'rgba(185,138,60,0.3)' },
    green:  { bg: 'rgba(63,109,51,0.12)', text: '#3f6d33', border: 'rgba(63,109,51,0.25)' },
    red:    { bg: 'rgba(179,57,57,0.12)', text: '#b33939', border: 'rgba(179,57,57,0.25)' },
    blue:   { bg: 'rgba(66,106,150,0.12)', text: '#426a96', border: 'rgba(66,106,150,0.25)' },
  }
  const c = colors[color] || colors.gold
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap'
    }}>{text}</span>
  )
}

export const StatCard = ({ label, value, icon, accent = '#B98A3C', sub }) => (
  <div style={{
    background: 'rgba(255, 249, 243, 0.96)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 18,
    padding: '24px 28px', position: 'relative', overflow: 'hidden', boxShadow: '0 18px 40px rgba(31, 26, 22, 0.08)'
  }} className="fade-in">
    <div style={{ position: 'absolute', top: 18, right: 18, fontSize: 24, opacity: 0.14 }}>{icon}</div>
    <div style={{ color: '#7f7365', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
    <div style={{ color: accent, fontSize: 34, fontWeight: 700, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ color: '#4f463d', fontSize: 12, marginTop: 8 }}>{sub}</div>}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}33, transparent)` }} />
  </div>
)

export const Spinner = ({ size = 20 }) => (
  <div style={{ width: size, height: size, border: `2px solid rgba(145,109,60,0.2)`, borderTop: `2px solid #B98A3C`, borderRadius: '50%' }} className="spin" />
)

export const Modal = ({ title, onClose, children, width = 460 }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(31,26,22,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
    <div style={{ background: 'rgba(255,249,243,0.98)', border: '1px solid rgba(214,197,171,0.8)', borderRadius: 18, padding: 32, width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto' }} className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: '#1f1a16', fontSize: 18, fontWeight: 700 }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#7f7365', fontSize: 20, padding: 0 }}>✕</button>
      </div>
      {children}
    </div>
  </div>
)

export const FormField = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ color: '#4f463d', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>{label}</label>
    {children}
  </div>
)

export const BtnPrimary = ({ children, onClick, disabled, style = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: disabled ? '#d1c1a1' : '#B98A3C', color: disabled ? '#7f7365' : '#1f1a16',
    border: 'none', padding: '12px 26px', borderRadius: 12, fontWeight: 700,
    fontSize: 13, letterSpacing: '0.08em', cursor: disabled ? 'not-allowed' : 'pointer', boxShadow: disabled ? 'none' : '0 10px 20px rgba(185,138,60,0.18)', ...style
  }}>{children}</button>
)

export const BtnSecondary = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    background: 'transparent', color: '#B98A3C', border: '1px solid rgba(185,138,60,0.8)',
    padding: '12px 26px', borderRadius: 12, fontWeight: 700, fontSize: 13, ...style
  }}>{children}</button>
)

export const BtnGhost = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    background: 'transparent', color: '#7f7365', border: '1px solid rgba(145,109,60,0.24)',
    padding: '8px 16px', borderRadius: 10, fontSize: 12, ...style
  }}>{children}</button>
)

export const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
    <div>
      <div style={{ color: '#B98A3C', fontSize: 12, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>VOGUEVISION</div>
      <h1 style={{ color: '#1f1a16', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 34, fontWeight: 700, margin: '0 0 6px', letterSpacing: '0.08em' }}>{title}</h1>
      {subtitle && <p style={{ color: '#4f463d', fontSize: 15, margin: 0, maxWidth: 660, lineHeight: 1.7 }}>{subtitle}</p>}
    </div>
    {action}
  </div>
)

export const Card = ({ children, style = {} }) => (
  <div style={{ background: 'rgba(255,249,243,0.95)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 18, padding: 24, boxShadow: '0 18px 40px rgba(31, 26, 22, 0.08)', ...style }}>
    {children}
  </div>
)

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ background: 'rgba(255,249,243,0.98)', border: '1px solid rgba(214,197,171,0.7)', borderRadius: 12, padding: '12px 16px', color: '#1f1a16', fontSize: 14 }} />
)

export const GoldDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '48px 0' }}>
    <div style={{ flex: 1, height: 1, background: 'rgba(31, 26, 22, 0.12)' }} />
    <div style={{ color: '#B98A3C', fontSize: 18 }}>◈</div>
    <div style={{ flex: 1, height: 1, background: 'rgba(31, 26, 22, 0.12)' }} />
  </div>
)

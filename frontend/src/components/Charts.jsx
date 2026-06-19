// Simple SVG-based charts (no external library needed)

export const BarChart = ({ data = [], height = 180 }) => {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ color: '#C9A84C', fontSize: 11, fontWeight: 600 }}>{d.value}</div>
            <div style={{
              width: '100%', borderRadius: '3px 3px 0 0',
              background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.3)',
              height: `${(d.value / max) * (height - 44)}px`, transition: 'height 0.5s ease'
            }} />
            <div style={{ color: '#555', fontSize: 10, textAlign: 'center', lineHeight: 1.2 }}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const PieChart = ({ data = [], size = 130 }) => {
  if (!data.length) return null
  const total = data.reduce((s, d) => s + d.value, 0)
  const COLORS = ['#C9A84C', '#8B6914', '#E8D5A3', '#5a4520', '#967340', '#f0e0a0', '#3a2a10']
  let cumAngle = 0
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 360
    const start = cumAngle; cumAngle += angle
    const r = size / 2 - 6, cx = size / 2, cy = size / 2
    const toRad = deg => (deg - 90) * Math.PI / 180
    const x1 = cx + r * Math.cos(toRad(start))
    const y1 = cy + r * Math.sin(toRad(start))
    const x2 = cx + r * Math.cos(toRad(start + angle))
    const y2 = cy + r * Math.sin(toRad(start + angle))
    return { path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${angle > 180 ? 1 : 0},1 ${x2},${y2} Z`, color: COLORS[i % COLORS.length], label: d.label, pct: Math.round(d.value / total * 100) }
  })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke='#050505' strokeWidth={2} />)}
      </svg>
      <div style={{ flex: 1, minWidth: 120 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ color: '#777', fontSize: 12, flex: 1 }}>{s.label}</span>
            <span style={{ color: '#C9A84C', fontSize: 12, fontWeight: 600 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const LineChart = ({ data = [], labels = [], height = 160 }) => {
  if (!data.length) return null
  const max = Math.max(...data, 1)
  const W = 560, H = height
  const pts = data.map((v, i) => `${40 + i * ((W - 40) / (data.length - 1))},${H - 20 - (v / max) * (H - 40)}`)
  return (
    <svg width='100%' viewBox={`0 0 ${W} ${H}`} preserveAspectRatio='xMidYMid meet' style={{ display: 'block' }}>
      <defs>
        <linearGradient id='lg' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#C9A84C' stopOpacity='0.25' />
          <stop offset='100%' stopColor='#C9A84C' stopOpacity='0' />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map(p => <line key={p} x1={40} y1={H - 20 - p * (H - 40) / 100} x2={W} y2={H - 20 - p * (H - 40) / 100} stroke='#1a1a1a' strokeWidth={1} />)}
      <polygon points={`40,${H - 20} ${pts.join(' ')} ${40 + (data.length - 1) * ((W - 40) / (data.length - 1))},${H - 20}`} fill='url(#lg)' />
      <polyline points={pts.join(' ')} fill='none' stroke='#C9A84C' strokeWidth={2} />
      {pts.map((p, i) => { const [x, y] = p.split(','); return <circle key={i} cx={x} cy={y} r={3} fill='#C9A84C' /> })}
      {labels.map((l, i) => <text key={i} x={40 + i * ((W - 40) / (data.length - 1))} y={H - 2} textAnchor='middle' fill='#555' fontSize={10}>{l}</text>)}
    </svg>
  )
}

import { useEffect, useState } from 'react'

const LABELS = {
  performance: 'Performance',
  seo: 'SEO',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
}

const RADIUS = 90
const ARC_LENGTH = Math.PI * RADIUS // length of a semicircle

function colorFor(score) {
  if (score === null) return '#B7BEC2'
  if (score >= 90) return 'var(--good)'
  if (score >= 50) return 'var(--warn)'
  return 'var(--bad)'
}

export default function ScoreGauge({ category, score }) {
  const [rotation, setRotation] = useState(-90)

  useEffect(() => {
    const target = score === null ? -90 : -90 + (score / 100) * 180
    const timer = setTimeout(() => setRotation(target), 80)
    return () => clearTimeout(timer)
  }, [score])

  const filled = score === null ? 0 : (score / 100) * ARC_LENGTH

  return (
    <div className="gauge-card h-100">
      <div className="gauge-label mb-2">{LABELS[category] || category}</div>
      <svg viewBox="0 0 200 120" width="100%" style={{ maxWidth: 180 }}>
        <path
          d="M10,110 A90,90 0 0 1 190,110"
          fill="none"
          className="gauge-arc-bg"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M10,110 A90,90 0 0 1 190,110"
          fill="none"
          stroke={colorFor(score)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${ARC_LENGTH}`}
          style={{ transition: 'stroke-dasharray 0.9s ease-out' }}
        />
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '100px 110px', transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)' }}>
          <line x1="100" y1="110" x2="100" y2="34" stroke="#17202B" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="110" r="7" className="gauge-needle-cap" />
      </svg>
      <div className="gauge-value" style={{ fontSize: '1.6rem', color: colorFor(score) }}>
        {score === null ? '—' : score}
      </div>
    </div>
  )
}

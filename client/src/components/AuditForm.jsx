import { useState } from 'react'

export default function AuditForm({ onSubmit, loading }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    onSubmit(normalized)
  }

  return (
    <div className={`scan-panel ${loading ? 'is-scanning' : ''}`}>
      <div className="section-eyebrow mb-2">Run a scan</div>
      <h2 className="font-display mb-3" style={{ fontWeight: 600 }}>
        Enter a URL to audit
      </h2>
      <form onSubmit={handleSubmit} className="d-flex" style={{ maxWidth: 620 }}>
        <input
          type="text"
          className="scan-input flex-grow-1"
          placeholder="example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          aria-label="Website URL to audit"
        />
        <button type="submit" className="btn-scan" disabled={loading}>
          {loading ? 'Scanning…' : 'Scan site'}
        </button>
      </form>
      <p className="font-mono mt-3 mb-0" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
        Checks performance, SEO, accessibility &amp; best practices via Google PageSpeed Insights.
      </p>
    </div>
  )
}

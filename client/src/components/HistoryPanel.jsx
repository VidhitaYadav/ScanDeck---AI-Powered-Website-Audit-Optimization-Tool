export default function HistoryPanel({ history, onSelect, onClear }) {
  if (!history.length) {
    return (
      <p className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
        No scans yet. Run your first audit above.
      </p>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="section-eyebrow">Recent scans</span>
        <button
          className="btn btn-link btn-sm p-0 font-mono"
          style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}
          onClick={onClear}
        >
          Clear
        </button>
      </div>
      <div className="d-flex flex-column gap-2">
        {history.map((entry) => (
          <button
            key={entry.fetchedAt}
            className="history-chip"
            onClick={() => onSelect(entry)}
          >
            <div className="d-flex justify-content-between">
              <span>{entry.url.replace(/^https?:\/\//, '')}</span>
              <span style={{ color: 'var(--ink-soft)' }}>
                {entry.scores.performance ?? '—'}
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)' }}>
              {new Date(entry.fetchedAt).toLocaleString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

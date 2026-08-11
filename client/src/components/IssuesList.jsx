const CATEGORY_LABELS = {
  performance: 'Performance',
  seo: 'SEO',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
}

export default function IssuesList({ issues }) {
  if (!issues.length) {
    return (
      <div className="issue-row">
        <span className="severity-dot severity-good" />
        <div>No significant issues detected. This page is in good shape.</div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column gap-2">
      {issues.map((issue) => (
        <div className="issue-row" key={issue.id}>
          <span className={`severity-dot severity-${issue.severity}`} />
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div style={{ fontWeight: 500 }}>{issue.title}</div>
              <span className="badge-tick">{CATEGORY_LABELS[issue.category] || issue.category}</span>
            </div>
            {issue.description && (
              <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }} className="mt-1">
                {issue.description}
              </div>
            )}
            {issue.displayValue && (
              <div className="font-mono mt-1" style={{ fontSize: '0.78rem' }}>
                {issue.displayValue}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

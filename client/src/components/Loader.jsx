export default function Loader({ label = 'Scanning page…' }) {
  return (
    <div className="text-center py-4">
      <div className="spinner-border" role="status" style={{ color: 'var(--accent)' }} />
      <div className="font-mono mt-2" style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
        {label}
      </div>
    </div>
  )
}

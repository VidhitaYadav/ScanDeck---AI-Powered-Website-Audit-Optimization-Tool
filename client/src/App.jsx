import { useEffect, useState } from 'react'
import AuditForm from './components/AuditForm'
import ScoreGauge from './components/ScoreGauge'
import IssuesList from './components/IssuesList'
import AIRecommendations from './components/AIRecommendations'
import HistoryPanel from './components/HistoryPanel'
import Loader from './components/Loader'
import { runAudit } from './services/pagespeedService'
import { getHistory, saveAudit, clearHistory } from './utils/storage'

const CATEGORY_ORDER = ['performance', 'seo', 'accessibility', 'best-practices']

export default function App() {
  const [auditData, setAuditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  async function handleScan(url) {
    setLoading(true)
    setError(null)
    setAuditData(null)
    try {
      const result = await runAudit(url)
      setAuditData(result)
      setHistory(saveAudit(result))
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          'Could not audit that URL. Check that it is publicly reachable and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleClearHistory() {
    clearHistory()
    setHistory([])
  }

  return (
    <div>
      <header className="topbar py-3">
        <div className="container d-flex align-items-center gap-3">
          <div className="brand-mark" />
          <div>
            <div className="font-display" style={{ fontWeight: 700, fontSize: '1.15rem' }}>
              ScanDeck
            </div>
            <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
              WEBSITE AUDIT &amp; OPTIMIZATION
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8">
            <AuditForm onSubmit={handleScan} loading={loading} />

            {error && (
              <div className="issue-row mt-3">
                <span className="severity-dot severity-bad" />
                <div>{error}</div>
              </div>
            )}

            {loading && <Loader />}

            {auditData && !loading && (
              <>
                <div className="row g-3 mt-4">
                  {CATEGORY_ORDER.map((category) => (
                    <div className="col-6 col-md-3" key={category}>
                      <ScoreGauge category={category} score={auditData.scores[category]} />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="section-eyebrow mb-2">
                    {auditData.issues.length} issue{auditData.issues.length === 1 ? '' : 's'} found
                  </div>
                  <IssuesList issues={auditData.issues} />
                </div>

                <div className="mt-4">
                  <AIRecommendations auditData={auditData} />
                </div>
              </>
            )}
          </div>

          <div className="col-lg-4">
            <div className="scan-panel">
              <HistoryPanel
                history={history}
                onSelect={(entry) => setAuditData(entry)}
                onClear={handleClearHistory}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
        Built with React, Bootstrap &amp; Google PageSpeed Insights
      </footer>
    </div>
  )
}

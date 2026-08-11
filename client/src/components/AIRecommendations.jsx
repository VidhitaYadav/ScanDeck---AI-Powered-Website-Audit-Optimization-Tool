import { useState } from 'react'
import { getAIRecommendations } from '../services/aiService'

export default function AIRecommendations({ auditData }) {
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const result = await getAIRecommendations(auditData)
      setRecommendations(result)
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Could not reach the recommendation service. Is the backend server running?'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-panel">
      <span className="ai-tag">AI RECOMMENDATIONS</span>
      <h3 className="font-display" style={{ fontWeight: 600 }}>
        What to fix first
      </h3>

      {!recommendations && !loading && (
        <>
          <p style={{ color: '#C4CCDA' }}>
            Generate plain-English fix suggestions for the issues found on this page.
          </p>
          <button className="btn-scan" onClick={handleGenerate}>
            Generate recommendations
          </button>
        </>
      )}

      {loading && <p className="font-mono mb-0">Analyzing audit results…</p>}

      {error && (
        <p style={{ color: '#F2A79C' }} className="mb-0">
          {error}
        </p>
      )}

      {recommendations && (
        <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>{recommendations}</div>
      )}
    </div>
  )
}

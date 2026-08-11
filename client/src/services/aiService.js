import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Sends a compact summary of the audit (not the whole Lighthouse payload) to
// our own backend, which forwards it to the AI model and hides the API key.
export async function getAIRecommendations(auditData) {
  const summary = {
    url: auditData.url,
    scores: auditData.scores,
    topIssues: auditData.issues.slice(0, 10).map((issue) => ({
      title: issue.title,
      category: issue.category,
      displayValue: issue.displayValue,
    })),
  }

  const { data } = await axios.post(`${API_BASE_URL}/api/recommendations`, summary)
  return data.recommendations
}

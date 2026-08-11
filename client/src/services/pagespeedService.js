import axios from 'axios'

const API_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
const CATEGORIES = ['performance', 'seo', 'accessibility', 'best-practices']

// Calls Google's PageSpeed Insights API and reshapes the (large) Lighthouse
// response into just what the UI needs: 4 category scores + a flat issue list.
export async function runAudit(targetUrl) {
  const apiKey = import.meta.env.VITE_PAGESPEED_API_KEY

  const params = {
    url: targetUrl,
    category: CATEGORIES,
    strategy: 'mobile',
  }
  if (apiKey) params.key = apiKey

  const { data } = await axios.get(API_ENDPOINT, { params })

  const lighthouse = data.lighthouseResult
  if (!lighthouse) {
    throw new Error('PageSpeed Insights returned no report for this URL.')
  }

  const scores = {}
  for (const category of CATEGORIES) {
    const cat = lighthouse.categories[category]
    scores[category] = cat ? Math.round(cat.score * 100) : null
  }

  const issues = extractIssues(lighthouse)

  return {
    url: targetUrl,
    fetchedAt: new Date().toISOString(),
    scores,
    issues,
    finalUrl: lighthouse.finalUrl,
  }
}

function extractIssues(lighthouse) {
  const auditRefsByCategory = {}
  for (const category of CATEGORIES) {
    const cat = lighthouse.categories[category]
    if (!cat) continue
    for (const ref of cat.auditRefs) {
      auditRefsByCategory[ref.id] = category
    }
  }

  const issues = []
  for (const [auditId, audit] of Object.entries(lighthouse.audits)) {
    // Only keep audits that failed or scored below "good" and are actionable
    // (scoreDisplayMode 'notApplicable'/'informative' audits are noise here).
    if (audit.score === null) continue
    if (audit.score >= 0.9) continue
    if (!['binary', 'numeric'].includes(audit.scoreDisplayMode)) continue

    issues.push({
      id: auditId,
      title: audit.title,
      description: audit.description ? audit.description.split('. [')[0] : '',
      displayValue: audit.displayValue || '',
      score: audit.score,
      category: auditRefsByCategory[auditId] || 'other',
      severity: audit.score < 0.5 ? 'bad' : 'warn',
    })
  }

  return issues.sort((a, b) => a.score - b.score)
}

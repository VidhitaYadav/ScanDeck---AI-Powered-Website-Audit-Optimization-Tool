import { Router } from 'express'
import axios from 'axios'

const router = Router()

// `gemini-1.5-flash` has been retired. Keep the model configurable so it can
// be changed without a code deployment when Google updates its model catalog.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

router.post('/recommendations', async (req, res) => {
  const { url, scores, topIssues } = req.body

  if (!url || !scores || !Array.isArray(topIssues)) {
    return res.status(400).json({ error: 'Request must include url, scores, and topIssues.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server is missing GEMINI_API_KEY. Add it to server/.env and restart the server.',
    })
  }

  const prompt = buildPrompt(url, scores, topIssues)

  try {
    const { data } = await axios.post(
      `${GEMINI_ENDPOINT}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
      },
      { headers: { 'Content-Type': 'application/json' } }
    )

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return res.status(502).json({ error: 'The AI model returned an empty response.' })
    }

    res.json({ recommendations: text.trim() })
  } catch (err) {
    const status = err.response?.status
    const providerMessage = err.response?.data?.error?.message
    console.error('Gemini API error:', status || 'network error', providerMessage || err.message)

    if (status === 401 || status === 403) {
      return res.status(502).json({
        error: 'Gemini rejected the API key. Verify GEMINI_API_KEY in server/.env and restart the server.',
      })
    }

    if (status === 404) {
      return res.status(502).json({
        error: `Gemini model "${GEMINI_MODEL}" is unavailable. Set GEMINI_MODEL to a model available to this API key.`,
      })
    }

    if (status === 429) {
      return res.status(429).json({
        error: 'Gemini rate limit or quota reached. Please wait a moment and try again.',
      })
    }

    res.status(502).json({
      error: providerMessage || 'Could not reach the AI model. Please try again.',
    })
  }
})

function buildPrompt(url, scores, topIssues) {
  const issueLines = topIssues
    .map((issue) => `- [${issue.category}] ${issue.title} (${issue.displayValue || 'flagged'})`)
    .join('\n')

  return `You are a senior web performance consultant reviewing an automated Lighthouse audit for ${url}.

Scores (0-100): Performance ${scores.performance}, SEO ${scores.seo}, Accessibility ${scores.accessibility}, Best Practices ${scores['best-practices']}.

Top issues detected:
${issueLines}

Write a short, prioritized action plan (max 5 bullet points) telling a developer exactly what to fix first and why it matters for real users. Keep it concise and practical, no headings, plain bullet points starting with "-".`
}

export default router

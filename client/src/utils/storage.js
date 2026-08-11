// Handles saving and retrieving audit history from the browser's localStorage.
// Keyed by URL so repeat scans of the same site build a mini timeline.

const STORAGE_KEY = 'scandeck_history_v1'
const MAX_ENTRIES = 25

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Could not read audit history:', err)
    return []
  }
}

export function saveAudit(entry) {
  try {
    const history = getHistory()
    const next = [entry, ...history].slice(0, MAX_ENTRIES)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  } catch (err) {
    console.error('Could not save audit to history:', err)
    return getHistory()
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function request(path, { method = 'GET', body, token, raw = false } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `リクエストに失敗しました (${res.status})`)
  }
  if (raw) return res
  return res.json()
}

export const api = {
  register: (username, password) =>
    request('/api/auth/register', { method: 'POST', body: { username, password } }),
  login: (username, password) =>
    request('/api/auth/login', { method: 'POST', body: { username, password } }),
  me: (token) => request('/api/me', { token }),
  entries: (token) => request('/api/entries', { token }),
  createEntry: (payload, token) => request('/api/entries', { method: 'POST', body: payload, token }),
  reportUrl: () => `${API_BASE}/api/report`,
  demo: () => request('/api/demo'),
  demoReportUrl: () => `${API_BASE}/api/demo/report`,
}

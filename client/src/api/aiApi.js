import api from './client'

export const generateEmail = (lead_id, tone = 'professional') =>
  api.post('/ai/generate-email', { lead_id, tone }).then((r) => r.data)

export const generateCallScript = (lead_id) =>
  api.post('/ai/generate-call-script', { lead_id }).then((r) => r.data)

export const analyzeLead = (lead_id) =>
  api.post('/ai/analyze-lead', { lead_id }).then((r) => r.data)

export const suggestSearches = (city) =>
  api.get('/ai/suggest-searches', { params: { city } }).then((r) => r.data)

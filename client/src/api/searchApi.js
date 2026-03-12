import api from './client'

export const scanForLeads = (data) => api.post('/search/scan', data).then((r) => r.data)

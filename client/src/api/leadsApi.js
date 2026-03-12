import api from './client'

export const getLeads = (params) => api.get('/leads', { params }).then((r) => r.data)
export const getLead = (id) => api.get(`/leads/${id}`).then((r) => r.data)
export const createLead = (data) => api.post('/leads', data).then((r) => r.data)
export const updateLead = (id, data) => api.put(`/leads/${id}`, data).then((r) => r.data)
export const deleteLead = (id) => api.delete(`/leads/${id}`).then((r) => r.data)
export const bulkUpdateLeads = (data) => api.post('/leads/bulk', data).then((r) => r.data)
export const exportLeadsCsv = (params) => api.get('/leads/export', { params, responseType: 'blob' })

import api from './client'

export const getOutreachLogs = (leadId) => api.get(`/outreach/${leadId}`).then((r) => r.data)
export const sendOutreachEmail = (data) => api.post('/outreach/email', data).then((r) => r.data)
export const logCall = (data) => api.post('/outreach/log-call', data).then((r) => r.data)

export const getTemplates = () => api.get('/outreach/templates/list').then((r) => r.data)
export const createTemplate = (data) => api.post('/outreach/templates', data).then((r) => r.data)
export const updateTemplate = (id, data) => api.put(`/outreach/templates/${id}`, data).then((r) => r.data)
export const deleteTemplate = (id) => api.delete(`/outreach/templates/${id}`).then((r) => r.data)

export const getCampaigns = () => api.get('/campaigns').then((r) => r.data)
export const createCampaign = (data) => api.post('/campaigns', data).then((r) => r.data)
export const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data).then((r) => r.data)
export const activateCampaign = (id) => api.post(`/campaigns/${id}/activate`).then((r) => r.data)
export const pauseCampaign = (id) => api.post(`/campaigns/${id}/pause`).then((r) => r.data)

export const getAnalytics = () => api.get('/analytics/overview').then((r) => r.data)
export const getFunnel = () => api.get('/analytics/funnel').then((r) => r.data)
export const getCategories = () => api.get('/analytics/categories').then((r) => r.data)
export const getDailyLeads = (days) => api.get('/analytics/daily', { params: { days } }).then((r) => r.data)
export const getActivity = () => api.get('/analytics/activity').then((r) => r.data)

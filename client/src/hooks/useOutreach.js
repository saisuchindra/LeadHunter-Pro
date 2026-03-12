import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOutreachLogs, sendOutreachEmail, logCall,
  getTemplates, createTemplate,
  getAnalytics, getDailyLeads, getCategories, getActivity, getFunnel,
  getCampaigns, createCampaign, activateCampaign, pauseCampaign,
} from '../api/outreachApi'

export function useOutreachLogs(leadId) {
  return useQuery({
    queryKey: ['outreach', leadId],
    queryFn: () => getOutreachLogs(leadId),
    enabled: !!leadId,
  })
}

export function useSendEmail() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: sendOutreachEmail,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['outreach'] })
      qc.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export function useLogCall() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: logCall,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach'] }),
  })
}

export function useTemplates() {
  return useQuery({ queryKey: ['templates'], queryFn: getTemplates })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  })
}

export function useAnalytics() {
  return useQuery({ queryKey: ['analytics'], queryFn: getAnalytics })
}

export function useDailyLeads(days = 14) {
  return useQuery({ queryKey: ['daily-leads', days], queryFn: () => getDailyLeads(days) })
}

export function useCategoryBreakdown() {
  return useQuery({ queryKey: ['categories'], queryFn: getCategories })
}

export function useActivityFeed() {
  return useQuery({ queryKey: ['activity'], queryFn: getActivity })
}

export function useFunnel() {
  return useQuery({ queryKey: ['funnel'], queryFn: getFunnel })
}

export function useCampaigns() {
  return useQuery({ queryKey: ['campaigns'], queryFn: getCampaigns })
}

export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  })
}

export function useActivateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: activateCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  })
}

export function usePauseCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: pauseCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  })
}

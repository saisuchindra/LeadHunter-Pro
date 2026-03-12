import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLeads, getLead, createLead, updateLead, deleteLead, bulkUpdateLeads } from '../api/leadsApi'

export function useLeadsList(params) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => getLeads(params),
  })
}

export function useLead(id) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id),
    enabled: !!id,
  })
}

export function useCreateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createLead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useUpdateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['lead'] })
    },
  })
}

export function useDeleteLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useBulkUpdate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: bulkUpdateLeads,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

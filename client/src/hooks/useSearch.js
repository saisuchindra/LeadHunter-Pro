import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanForLeads } from '../api/searchApi'

export function useScan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: scanForLeads,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

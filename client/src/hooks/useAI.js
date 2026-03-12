import { useMutation, useQuery } from '@tanstack/react-query'
import { generateEmail, generateCallScript, analyzeLead, suggestSearches } from '../api/aiApi'

export function useGenerateEmail() {
  return useMutation({
    mutationFn: ({ lead_id, tone }) => generateEmail(lead_id, tone),
  })
}

export function useGenerateCallScript() {
  return useMutation({
    mutationFn: ({ lead_id }) => generateCallScript(lead_id),
  })
}

export function useAnalyzeLead() {
  return useMutation({
    mutationFn: ({ lead_id }) => analyzeLead(lead_id),
  })
}

export function useSuggestSearches(city) {
  return useQuery({
    queryKey: ['ai-suggest', city],
    queryFn: () => suggestSearches(city),
    enabled: !!city && city.length > 2,
    staleTime: 5 * 60 * 1000,
  })
}

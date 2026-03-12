import { create } from 'zustand'

const useLeadsStore = create((set) => ({
  selectedIds: [],
  filters: {
    category: '',
    city: '',
    status: '',
    minScore: 0,
    maxScore: 100,
    search: '',
  },

  toggleSelect: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((i) => i !== id)
        : [...s.selectedIds, id],
    })),

  selectAll: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),

  resetFilters: () =>
    set({
      filters: { category: '', city: '', status: '', minScore: 0, maxScore: 100, search: '' },
    }),
}))

export default useLeadsStore

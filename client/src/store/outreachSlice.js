import { create } from 'zustand'

const useOutreachStore = create((set) => ({
  activeTemplateId: null,
  composerOpen: false,
  composerLeadId: null,

  openComposer: (leadId) => set({ composerOpen: true, composerLeadId: leadId }),
  closeComposer: () => set({ composerOpen: false, composerLeadId: null }),
  setActiveTemplate: (id) => set({ activeTemplateId: id }),
}))

export default useOutreachStore

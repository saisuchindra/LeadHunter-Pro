import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Download } from 'lucide-react'
import { useLeadsList, useBulkUpdate, useDeleteLead } from '../hooks/useLeads'
import { exportLeadsCsv } from '../api/leadsApi'
import useLeadsStore from '../store/leadsSlice'
import Card from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LeadFilters from '../components/leads/LeadFilters'
import LeadScoreBar from '../components/leads/LeadScoreBar'
import BulkActionBar from '../components/leads/BulkActionBar'
import Spinner from '../components/ui/Spinner'
import { getScoreLabel } from '../utils/scoreCalculator'
import { downloadBlob } from '../utils/exportUtils'

export default function LeadDatabase() {
  const navigate = useNavigate()
  const filters = useLeadsStore((s) => s.filters)
  const selectedIds = useLeadsStore((s) => s.selectedIds)
  const selectAll = useLeadsStore((s) => s.selectAll)
  const clearSelection = useLeadsStore((s) => s.clearSelection)

  const { data, isLoading } = useLeadsList(filters)
  const bulkUpdate = useBulkUpdate()
  const deleteLead = useDeleteLead()

  const leads = data?.leads || []

  const handleExport = async () => {
    try {
      const res = await exportLeadsCsv(filters)
      downloadBlob(res.data, 'leads.csv')
      toast.success('CSV exported')
    } catch {
      toast.error('Export failed')
    }
  }

  const columns = [
    { key: 'business_name', label: 'Business', render: (r) => (
      <span className="font-medium">{r.business_name}</span>
    )},
    { key: 'category', label: 'Category', render: (r) => (
      <span className="capitalize text-[#5A5A7A] text-xs">{r.category?.replace('_', ' ')}</span>
    )},
    { key: 'city', label: 'City' },
    { key: 'opportunity_score', label: 'Score', render: (r) => (
      <div className="w-24"><LeadScoreBar score={r.opportunity_score || 0} /></div>
    )},
    { key: 'status', label: 'Status', render: (r) => <Badge label={r.status} /> },
    { key: 'updated_at', label: 'Last Action', render: (r) => (
      <span className="text-xs text-[#5A5A7A]">
        {r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '—'}
      </span>
    )},
  ]

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Spinner /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl">All Leads</h1>
        <div className="flex items-center gap-3">
          <span className="text-[#5A5A7A] text-sm font-mono">{data?.total || 0} leads</span>
          <Button variant="secondary" className="text-xs" onClick={handleExport}>
            <Download size={14} /> Export CSV
          </Button>
        </div>
      </div>

      <LeadFilters />

      <Card className="p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={leads}
          selectable
          selectedIds={selectedIds}
          onToggleSelect={selectAll}
          onRowClick={(row) => navigate(`/leads/${row.id}`)}
        />
      </Card>

      <BulkActionBar
        count={selectedIds.length}
        onStatusChange={() => {
          bulkUpdate.mutate({ ids: selectedIds, status: 'contacted' }, {
            onSuccess: () => { clearSelection(); toast.success('Status updated'); },
          })
        }}
        onDelete={() => {
          selectedIds.forEach((id) => deleteLead.mutate(id))
          clearSelection()
          toast.success('Leads deleted')
        }}
      />
    </div>
  )
}

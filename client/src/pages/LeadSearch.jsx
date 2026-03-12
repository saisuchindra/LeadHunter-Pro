import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useScan } from '../hooks/useSearch'
import SearchPanel from '../components/search/SearchPanel'
import ScanAnimation from '../components/search/ScanAnimation'
import ResultsPreview from '../components/search/ResultsPreview'

export default function LeadSearch() {
  const navigate = useNavigate()
  const scan = useScan()
  const [results, setResults] = useState([])

  const handleScan = async (params) => {
    setResults([])
    try {
      const data = await scan.mutateAsync(params)
      setResults(data.leads || [])
      toast.success(`Found ${data.count} leads!`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Scan failed')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl">Lead Search</h1>

      <SearchPanel onScan={handleScan} loading={scan.isPending} />

      {scan.isPending && <ScanAnimation phase="scanning" />}

      {!scan.isPending && results.length > 0 && (
        <ResultsPreview
          leads={results}
          onClick={(lead) => navigate(`/leads/${lead.id}`)}
        />
      )}

      {!scan.isPending && results.length === 0 && !scan.isIdle && (
        <p className="text-center text-[#5A5A7A] py-12">
          No businesses matching your criteria were found. Try adjusting your filters.
        </p>
      )}
    </div>
  )
}

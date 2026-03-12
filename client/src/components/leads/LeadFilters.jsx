import useLeadsStore from '../../store/leadsSlice'

const categories = ['cafe', 'restaurant', 'architecture_firm', 'retail', 'salon', 'gym', 'hotel']
const statuses = ['new', 'contacted', 'replied', 'meeting', 'client', 'lost']

export default function LeadFilters() {
  const filters = useLeadsStore((s) => s.filters)
  const setFilter = useLeadsStore((s) => s.setFilter)
  const reset = useLeadsStore((s) => s.resetFilters)

  const selectClass =
    'bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-[#E8E8F0] outline-none focus:border-mint/40 transition-colors'

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Category</label>
        <select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
          className={selectClass}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[#5A5A7A] text-xs font-mono block mb-1">City</label>
        <input
          value={filters.city}
          onChange={(e) => setFilter('city', e.target.value)}
          placeholder="Any city"
          className={selectClass + ' w-32'}
        />
      </div>

      <div>
        <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value)}
          className={selectClass}
        >
          <option value="">All</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Min Score</label>
        <input
          type="number"
          min={0}
          max={100}
          value={filters.minScore}
          onChange={(e) => setFilter('minScore', Number(e.target.value))}
          className={selectClass + ' w-20'}
        />
      </div>

      <div>
        <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Search</label>
        <input
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="Name or address"
          className={selectClass + ' w-44'}
        />
      </div>

      <button
        onClick={reset}
        className="text-xs text-[#5A5A7A] hover:text-mint transition-colors py-2"
      >
        Reset
      </button>
    </div>
  )
}

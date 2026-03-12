import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { useSuggestSearches } from '../../hooks/useAI'

const categoryOptions = [
  'cafe', 'restaurant', 'architecture_firm', 'retail', 'salon', 'gym', 'hotel',
]

export default function SearchPanel({ onScan, loading }) {
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [radius, setRadius] = useState(10)
  const [filters, setFilters] = useState({
    noWebsite: true,
    noGmb: false,
    lowReviews: false,
    noSocial: false,
  })
  const { data: suggestions } = useSuggestSearches(city)

  const handleScan = () => {
    if (!category || !city) return
    onScan({ category, city, radius, filters })
  }

  const inputClass =
    'bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-[#E8E8F0] outline-none focus:border-mint/40 transition-colors w-full'

  return (
    <Card>
      <h2 className="font-display font-bold text-lg mb-4">Scan Configuration</h2>

      {/* AI Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-violet/5 border border-violet/20">
          <p className="text-xs font-mono text-violet flex items-center gap-1 mb-2"><Sparkles size={12} /> AI Suggested Categories for {city}</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setCategory(s.category)}
                className="text-xs px-2 py-1 rounded-md bg-white/[0.05] text-[#E8E8F0] hover:bg-violet/20 transition-colors"
                title={s.reason}
              >
                {s.category}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Business Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            <option value="">Select category...</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[#5A5A7A] text-xs font-mono block mb-1">City / Location</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Mumbai, Delhi..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-[#5A5A7A] text-xs font-mono block mb-1">
            Radius: {radius}km
          </label>
          <input
            type="range"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-mint"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { key: 'noWebsite', label: 'No website listed' },
          { key: 'noGmb', label: 'No Google My Business' },
          { key: 'lowReviews', label: 'Less than 3 reviews' },
          { key: 'noSocial', label: 'No social media links' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 text-sm text-[#E8E8F0] cursor-pointer">
            <input
              type="checkbox"
              checked={filters[key]}
              onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.checked }))}
              className="accent-mint"
            />
            {label}
          </label>
        ))}
      </div>

      <Button
        variant="primary"
        glow
        className="text-base px-8 py-3"
        onClick={handleScan}
        disabled={loading || !category || !city}
      >
        <Search size={18} /> SCAN FOR LEADS
      </Button>
    </Card>
  )
}

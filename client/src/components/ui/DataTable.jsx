import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

export default function DataTable({ columns, data, onRowClick, selectable, selectedIds = [], onToggleSelect }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const av = a[sortKey], bv = b[sortKey]
    if (av == null) return 1
    if (bv == null) return -1
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv
    return sortDir === 'asc' ? cmp : -cmp
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07]">
            {selectable && (
              <th className="py-3 px-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={(e) => {
                    if (e.target.checked) onToggleSelect?.(data.map((d) => d.id))
                    else onToggleSelect?.([])
                  }}
                  className="accent-mint"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                className={clsx(
                  'py-3 px-3 text-left text-[#5A5A7A] text-xs font-mono uppercase tracking-wider',
                  col.sortable !== false && 'cursor-pointer hover:text-[#E8E8F0]'
                )}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key && (
                    sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              {selectable && (
                <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => onToggleSelect?.(
                      selectedIds.includes(row.id)
                        ? selectedIds.filter((i) => i !== row.id)
                        : [...selectedIds, row.id]
                    )}
                    className="accent-mint"
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <p className="text-center text-[#5A5A7A] py-12 text-sm">No data found</p>
      )}
    </div>
  )
}

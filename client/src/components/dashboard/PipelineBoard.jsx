import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

const defaultColumns = [
  { id: 'new', label: 'New Leads', color: '#7B61FF' },
  { id: 'contacted', label: 'Contacted', color: '#3B82F6' },
  { id: 'replied', label: 'Replied', color: '#00FFB2' },
  { id: 'meeting', label: 'Meeting Booked', color: '#FFB347' },
  { id: 'client', label: 'Client ✓', color: '#22C55E' },
  { id: 'lost', label: 'Lost', color: '#FF4D6D' },
]

const categoryEmojis = {
  cafe: '☕', restaurant: '🍽️', architecture_firm: '🏛️', retail: '🛍️',
  salon: '💇', gym: '🏋️', hotel: '🏨',
}

export default function PipelineBoard({ leads = [], onStatusChange }) {
  const grouped = {}
  for (const col of defaultColumns) {
    grouped[col.id] = leads.filter((l) => l.status === col.id)
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {defaultColumns.map((col) => (
          <div key={col.id} className="w-64 shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="text-xs font-mono text-[#5A5A7A] uppercase tracking-wider">{col.label}</span>
              <span className="text-xs font-mono text-[#5A5A7A] ml-auto">
                {grouped[col.id].length}
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {grouped[col.id].map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  className="glass-card p-3 cursor-pointer hover:border-white/[0.12] transition-colors"
                >
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <span>{categoryEmojis[lead.category] || '🏢'}</span>
                    {lead.business_name}
                  </p>
                  <p className="text-[10px] text-[#5A5A7A] mt-1">{lead.city}</p>
                </motion.div>
              ))}
              {grouped[col.id].length === 0 && (
                <div className="border border-dashed border-white/[0.07] rounded-lg p-4 text-center text-[#5A5A7A] text-xs">
                  No leads
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Plus, Send } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import LeadScoreBar from './LeadScoreBar'
import { getScoreLabel } from '../../utils/scoreCalculator'

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const categoryEmojis = {
  cafe: '☕', restaurant: '🍽️', architecture_firm: '🏛️', retail: '🛍️',
  salon: '💇', gym: '🏋️', hotel: '🏨', default: '🏢',
}

export default function LeadCard({ lead, onAdd, onEmail, onClick }) {
  const emoji = categoryEmojis[lead.category] || categoryEmojis.default
  const score = lead.opportunity_score || 0
  const label = getScoreLabel(score)
  const reasons = lead.score_reasons || []

  return (
    <motion.div variants={cardVariants}>
      <Card
        className="hover:border-white/[0.12] transition-colors cursor-pointer"
        onClick={() => onClick?.(lead)}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display font-bold text-base flex items-center gap-2">
              <span>{emoji}</span>
              {lead.business_name}
            </h3>
            <p className="text-[#5A5A7A] text-xs mt-0.5 capitalize">{lead.category?.replace('_', ' ')}</p>
          </div>
          <Badge label={label === 'HOT' ? 'HOT LEAD' : label} pulse={label === 'HOT'} />
        </div>

        <LeadScoreBar score={score} className="mb-3" />

        <div className="space-y-1.5 text-xs text-[#5A5A7A] mb-3">
          {lead.address && (
            <p className="flex items-center gap-1.5">
              <MapPin size={12} /> {lead.address}
            </p>
          )}
          {lead.phone && (
            <p className="flex items-center gap-1.5">
              <Phone size={12} /> {lead.phone}
            </p>
          )}
          {lead.email && (
            <p className="flex items-center gap-1.5">
              <Mail size={12} /> {lead.email}
            </p>
          )}
        </div>

        {/* Issue badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(Array.isArray(reasons) ? reasons : []).map((r) => (
            <Badge key={r} label={r.replace('_', ' ')} />
          ))}
        </div>

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {onAdd && (
            <Button variant="secondary" className="text-xs py-1.5" onClick={() => onAdd(lead)}>
              <Plus size={14} /> Add to DB
            </Button>
          )}
          {onEmail && lead.email && (
            <Button variant="ghost" className="text-xs py-1.5" onClick={() => onEmail(lead)}>
              <Send size={14} /> Quick Email
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

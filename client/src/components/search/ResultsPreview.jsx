import { motion } from 'framer-motion'
import LeadCard from '../leads/LeadCard'

const containerVariants = {
  animate: { transition: { staggerChildren: 0.07 } },
}

export default function ResultsPreview({ leads, onAdd, onEmail, onClick }) {
  if (!leads || leads.length === 0) return null

  return (
    <div>
      <h3 className="font-display font-bold text-base mb-4">
        {leads.length} results found
      </h3>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onAdd={onAdd}
            onEmail={onEmail}
            onClick={onClick}
          />
        ))}
      </motion.div>
    </div>
  )
}

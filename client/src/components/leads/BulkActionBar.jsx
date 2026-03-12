import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Tag, Trash2 } from 'lucide-react'
import Button from '../ui/Button'

export default function BulkActionBar({ count, onEmail, onCall, onStatusChange, onDelete }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-3 flex items-center gap-4"
        >
          <span className="text-sm text-[#5A5A7A] font-mono">{count} selected</span>
          <Button variant="primary" className="text-xs" onClick={onEmail}>
            <Mail size={14} /> Send Email
          </Button>
          <Button variant="secondary" className="text-xs" onClick={onCall}>
            <Phone size={14} /> Assign Call
          </Button>
          <Button variant="secondary" className="text-xs" onClick={onStatusChange}>
            <Tag size={14} /> Change Status
          </Button>
          <Button variant="danger" className="text-xs" onClick={onDelete}>
            <Trash2 size={14} /> Delete
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

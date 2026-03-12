import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl glass-card p-6 rounded-t-2xl max-h-[80vh] overflow-y-auto sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
          >
            {title && (
              <h2 className="text-lg font-display font-bold mb-4">{title}</h2>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

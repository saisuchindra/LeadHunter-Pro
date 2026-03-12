import { motion } from 'framer-motion'

export default function ScanAnimation({ phase = 'scanning', count = 0 }) {
  const phases = {
    scanning: 'Scanning Google Maps...',
    analyzing: 'Analyzing websites...',
    scoring: 'Scoring opportunities...',
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Radar circles */}
      <div className="relative w-40 h-40 mb-8">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-mint/30"
            animate={{
              scale: [1, 2.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeOut',
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-2 border-transparent border-t-mint"
          />
        </div>
      </div>

      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-mint font-mono text-sm mb-2"
      >
        {phases[phase] || phase}
      </motion.p>

      {count > 0 && (
        <p className="text-[#5A5A7A] text-xs font-mono">
          {count} businesses found...
        </p>
      )}

      {/* Progress bar */}
      <div className="w-64 h-1 bg-white/[0.06] rounded-full mt-4 overflow-hidden">
        <motion.div
          className="h-full bg-mint rounded-full"
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

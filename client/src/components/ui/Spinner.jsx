import { motion } from 'framer-motion'

export default function Spinner({ size = 32 }) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: size, height: size }}
        className="border-2 border-mint/20 border-t-mint rounded-full"
      />
    </div>
  )
}

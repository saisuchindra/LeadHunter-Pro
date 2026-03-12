import { motion } from 'framer-motion'
import clsx from 'clsx'

const variants = {
  primary: 'bg-mint text-black hover:brightness-110 shadow-[0_0_20px_rgba(0,255,178,0.15)]',
  danger: 'bg-coral text-white hover:brightness-110',
  ghost: 'bg-transparent border border-mint/40 text-mint hover:bg-mint/10',
  secondary: 'bg-white/[0.05] border border-white/[0.07] text-[#E8E8F0] hover:bg-white/[0.08]',
}

export default function Button({ variant = 'primary', className, children, glow, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={clsx(
        'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 inline-flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        glow && 'animate-pulse-mint',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

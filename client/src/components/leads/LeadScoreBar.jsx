import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { getScoreColor } from '../../utils/scoreCalculator'
import clsx from 'clsx'

export default function LeadScoreBar({ score, className }) {
  const color = getScoreColor(score)
  const motionWidth = useMotionValue(0)
  const springWidth = useSpring(motionWidth, { stiffness: 80, damping: 20 })
  const numRef = useRef(null)
  const numVal = useMotionValue(0)
  const numSpring = useSpring(numVal, { stiffness: 80, damping: 20 })

  useEffect(() => {
    motionWidth.set(score)
    numVal.set(score)
  }, [score, motionWidth, numVal])

  useEffect(() => {
    const unsub = numSpring.on('change', (v) => {
      if (numRef.current) numRef.current.textContent = Math.round(v)
    })
    return unsub
  }, [numSpring])

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: springWidth.get() + '%',
            backgroundColor: color,
          }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span ref={numRef} className="text-xs font-mono w-6 text-right" style={{ color }}>
        0
      </span>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Card from './Card'

export default function StatCard({ label, value, delta, icon: Icon, color }) {
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 80, damping: 20 })
  const ref = useRef(null)

  useEffect(() => {
    motionVal.set(value)
  }, [value, motionVal])

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString()
    })
    return unsubscribe
  }, [spring])

  return (
    <Card className="flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        {Icon && <Icon size={20} style={{ color }} />}
      </div>
      <div>
        <p className="text-[#5A5A7A] text-xs font-mono uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-display font-bold mt-0.5" ref={ref}>0</p>
        {delta && <p className="text-xs text-[#5A5A7A] mt-1">{delta}</p>}
      </div>
    </Card>
  )
}

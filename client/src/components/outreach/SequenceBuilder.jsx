import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, GripVertical, Trash2, Play } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const defaultSteps = [
  { id: '1', day: 0, label: 'Initial Cold Email', template: 'no_website' },
  { id: '2', day: 3, label: 'Follow-up #1', template: 'weak_seo' },
  { id: '3', day: 7, label: 'Follow-up #2', template: 'no_gmb' },
  { id: '4', day: 14, label: 'Final Follow-up', template: '' },
]

export default function SequenceBuilder({ onActivate }) {
  const [steps, setSteps] = useState(defaultSteps)

  const addStep = () => {
    const lastDay = steps.length > 0 ? steps[steps.length - 1].day : 0
    setSteps([
      ...steps,
      { id: String(Date.now()), day: lastDay + 3, label: `Step ${steps.length + 1}`, template: '' },
    ])
  }

  const removeStep = (id) => {
    setSteps(steps.filter((s) => s.id !== id))
  }

  const updateStep = (id, field, value) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const inputClass =
    'bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-1.5 text-sm text-[#E8E8F0] outline-none focus:border-mint/40 transition-colors'

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold">Email Sequence</h3>
        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs" onClick={addStep}>
            <Plus size={14} /> Add Step
          </Button>
          <Button variant="primary" className="text-xs" onClick={() => onActivate?.(steps)}>
            <Play size={14} /> Activate
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            layout
            className="flex items-center gap-3 bg-white/[0.02] rounded-lg p-3"
          >
            <GripVertical size={16} className="text-[#5A5A7A] cursor-grab shrink-0" />

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-mint text-xs font-mono">Day</span>
              <input
                type="number"
                min={0}
                value={step.day}
                onChange={(e) => updateStep(step.id, 'day', Number(e.target.value))}
                className={inputClass + ' w-16 text-center'}
              />
            </div>

            <input
              value={step.label}
              onChange={(e) => updateStep(step.id, 'label', e.target.value)}
              className={inputClass + ' flex-1'}
            />

            <select
              value={step.template}
              onChange={(e) => updateStep(step.id, 'template', e.target.value)}
              className={inputClass + ' w-40'}
            >
              <option value="">Select template...</option>
              <option value="no_website">No Website</option>
              <option value="weak_seo">Weak SEO</option>
              <option value="no_gmb">No Google Maps</option>
            </select>

            <button
              onClick={() => removeStep(step.id)}
              className="text-[#5A5A7A] hover:text-coral transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="absolute left-8 top-full w-px h-3 bg-white/[0.07]" />
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

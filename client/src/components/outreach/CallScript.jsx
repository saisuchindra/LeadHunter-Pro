import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { ChevronDown, ChevronUp, Printer } from 'lucide-react'

const scriptSections = [
  {
    title: 'Opening',
    generate: (lead) =>
      `"Hi, am I speaking with the owner or manager of ${lead.business_name}? My name is [Your Name] and I work with local businesses in ${lead.city} to help them grow their online presence."`,
  },
  {
    title: 'Pain Point',
    generate: (lead) => {
      const issues = lead.score_reasons || []
      if (issues.includes('NO_WEBSITE')) {
        return `"I noticed that ${lead.business_name} doesn't currently have a website. In today's digital world, that means potential customers searching online might not find you. Are you aware of how many customers could be going to your competitors instead?"`
      }
      return `"I took a look at your online presence and noticed a few areas where there's room for improvement — things like your Google listing and online reviews. These are easy wins that could bring you more foot traffic."`
    },
  },
  {
    title: 'Value Proposition',
    generate: (lead) =>
      `"We specialize in helping businesses like ${lead.business_name} get set up online quickly — a professional website, Google Maps optimization, and a simple system to get more reviews. Our clients typically see a 30-40% increase in customer inquiries within the first 3 months."`,
  },
  {
    title: 'Objection Handlers',
    generate: () =>
      `• "Too busy?" → "Totally understand. That's exactly why we handle everything for you — it takes less than 30 minutes of your time."
• "Too expensive?" → "We have plans starting from a very affordable price point, and we can show you the ROI within the first month."
• "Already have something?" → "Great! We'd love to just do a free review of what you have and suggest any quick improvements."`,
  },
  {
    title: 'Close',
    generate: (lead) =>
      `"Would you be open to a quick 15-minute meeting this week? I can show you exactly what we'd do for ${lead.business_name} — completely free, no obligation. What does your schedule look like on [Day]?"`,
  },
]

export default function CallScript({ lead }) {
  const [expanded, setExpanded] = useState({})

  if (!lead) {
    return (
      <Card>
        <p className="text-[#5A5A7A] text-sm">Select a lead to generate a call script.</p>
      </Card>
    )
  }

  const toggle = (title) => setExpanded((e) => ({ ...e, [title]: !e[title] }))

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold">Call Script: {lead.business_name}</h3>
        <Button variant="secondary" className="text-xs" onClick={() => window.print()}>
          <Printer size={14} /> Print
        </Button>
      </div>

      <div className="space-y-2">
        {scriptSections.map((section) => {
          const isOpen = expanded[section.title] !== false
          return (
            <div key={section.title} className="bg-white/[0.02] rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(section.title)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-white/[0.02] transition-colors"
              >
                {section.title}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-[#E8E8F0]/80 whitespace-pre-wrap leading-relaxed">
                  {section.generate(lead)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

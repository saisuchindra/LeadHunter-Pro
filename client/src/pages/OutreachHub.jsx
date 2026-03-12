import { useState } from 'react'
import { useLeadsList } from '../hooks/useLeads'
import EmailComposer from '../components/outreach/EmailComposer'
import CallScript from '../components/outreach/CallScript'
import SequenceBuilder from '../components/outreach/SequenceBuilder'
import Card from '../components/ui/Card'
import { toast } from 'react-hot-toast'
import { useSendEmail } from '../hooks/useOutreach'

export default function OutreachHub() {
  const [tab, setTab] = useState('email')
  const [selectedLeadId, setSelectedLeadId] = useState('')
  const { data: leadsData } = useLeadsList({ limit: 200 })
  const sendEmail = useSendEmail()

  const leads = leadsData?.leads || []
  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null

  const tabClass = (t) =>
    `px-4 py-2 text-sm font-mono rounded-lg transition-colors ${
      tab === t ? 'bg-mint/10 text-mint' : 'text-[#5A5A7A] hover:text-[#E8E8F0] hover:bg-white/[0.03]'
    }`

  const handleSend = ({ subject, body, template_id }) => {
    if (!selectedLeadId) return toast.error('Select a lead first')
    sendEmail.mutate({ lead_id: selectedLeadId, subject, body, template_id }, {
      onSuccess: () => toast.success('Email sent!'),
      onError: (err) => toast.error(err.response?.data?.error || 'Failed'),
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl">Outreach Hub</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        <button className={tabClass('email')} onClick={() => setTab('email')}>Email Composer</button>
        <button className={tabClass('call')} onClick={() => setTab('call')}>Call Script</button>
        <button className={tabClass('sequence')} onClick={() => setTab('sequence')}>Sequence Builder</button>
      </div>

      {/* Lead picker */}
      <Card>
        <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Select Lead</label>
        <select
          value={selectedLeadId}
          onChange={(e) => setSelectedLeadId(e.target.value)}
          className="bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-[#E8E8F0] outline-none focus:border-mint/40 w-full max-w-md"
        >
          <option value="">Choose a lead...</option>
          {leads.map((l) => (
            <option key={l.id} value={l.id}>{l.business_name} — {l.city}</option>
          ))}
        </select>
      </Card>

      {tab === 'email' && <EmailComposer lead={selectedLead} onSend={handleSend} />}
      {tab === 'call' && <CallScript lead={selectedLead} />}
      {tab === 'sequence' && <SequenceBuilder onActivate={(steps) => toast.success(`Sequence activated with ${steps.length} steps`)} />}
    </div>
  )
}

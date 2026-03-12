import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { MapPin, Phone, Mail as MailIcon, Globe, Star, AlertTriangle, Send, PhoneCall, StickyNote, ArrowLeft, Sparkles } from 'lucide-react'
import { useLead, useUpdateLead } from '../hooks/useLeads'
import { useOutreachLogs, useSendEmail, useLogCall } from '../hooks/useOutreach'
import { useAnalyzeLead, useGenerateCallScript } from '../hooks/useAI'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import LeadScoreBar from '../components/leads/LeadScoreBar'
import OutreachTimeline from '../components/outreach/OutreachTimeline'
import EmailComposer from '../components/outreach/EmailComposer'
import Modal from '../components/ui/Modal'
import { getScoreLabel, getScoreColor } from '../utils/scoreCalculator'

const statuses = ['new', 'contacted', 'replied', 'meeting', 'client', 'lost']

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: lead, isLoading } = useLead(id)
  const { data: logs } = useOutreachLogs(id)
  const updateLead = useUpdateLead()
  const sendEmail = useSendEmail()
  const logCallMutation = useLogCall()

  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [aiScript, setAiScript] = useState(null)
  const analyzeLead = useAnalyzeLead()
  const generateScript = useGenerateCallScript()

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Spinner /></div>
  }

  if (!lead) {
    return <p className="text-center text-[#5A5A7A] py-12">Lead not found.</p>
  }

  const score = lead.opportunity_score || 0
  const label = getScoreLabel(score)

  const handleStatusChange = (status) => {
    updateLead.mutate({ id, data: { status } }, {
      onSuccess: () => toast.success(`Status changed to ${status}`),
    })
  }

  const handleSendEmail = ({ subject, body, template_id }) => {
    sendEmail.mutate({ lead_id: id, subject, body, template_id }, {
      onSuccess: () => { setEmailModalOpen(false); toast.success('Email sent!'); },
      onError: (err) => toast.error(err.response?.data?.error || 'Failed to send'),
    })
  }

  const handleLogCall = () => {
    logCallMutation.mutate({ lead_id: id, notes: 'Call attempted' }, {
      onSuccess: () => toast.success('Call logged'),
    })
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return
    updateLead.mutate({ id, data: { notes: (lead.notes || '') + '\n' + noteText } }, {
      onSuccess: () => { setNoteText(''); toast.success('Note added'); },
    })
  }

  return (
    <div className="space-y-6">
      {/* Back button + Header */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#5A5A7A] hover:text-mint text-sm transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">{lead.business_name}</h1>
          <p className="text-[#5A5A7A] text-sm capitalize">{lead.category?.replace('_', ' ')} · {lead.city}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge label={lead.status} />
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-1.5 text-sm text-[#E8E8F0] outline-none"
          >
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button variant="primary" className="text-xs" onClick={() => setEmailModalOpen(true)}>
            <Send size={14} /> Send Email
          </Button>
          <Button variant="secondary" className="text-xs" onClick={handleLogCall}>
            <PhoneCall size={14} /> Log Call
          </Button>
        </div>
      </div>

      {/* Score bar */}
      <Card className="flex items-center gap-6">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-display font-bold text-xl"
            style={{ borderColor: getScoreColor(score), color: getScoreColor(score) }}
          >
            {score}
          </div>
          <p className="text-xs font-mono mt-1" style={{ color: getScoreColor(score) }}>{label}</p>
        </div>
        <div className="flex-1">
          <LeadScoreBar score={score} />
        </div>
      </Card>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-4">
          {/* Contact info */}
          <Card>
            <h3 className="font-display font-bold text-sm mb-3">Contact Info</h3>
            <div className="space-y-2 text-sm">
              {lead.address && <p className="flex items-center gap-2 text-[#E8E8F0]"><MapPin size={14} className="text-[#5A5A7A]" /> {lead.address}</p>}
              {lead.phone && <p className="flex items-center gap-2 text-[#E8E8F0]"><Phone size={14} className="text-[#5A5A7A]" /> {lead.phone}</p>}
              {lead.email && <p className="flex items-center gap-2 text-[#E8E8F0]"><MailIcon size={14} className="text-[#5A5A7A]" /> {lead.email}</p>}
              {lead.website_url && <p className="flex items-center gap-2 text-[#E8E8F0]"><Globe size={14} className="text-[#5A5A7A]" /> {lead.website_url}</p>}
            </div>
          </Card>

          {/* Issues */}
          <Card>
            <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-coral" /> Issues Detected
            </h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(lead.score_reasons) ? lead.score_reasons : []).map((r) => (
                <Badge key={r} label={r.replace('_', ' ')} />
              ))}
              {(!lead.score_reasons || lead.score_reasons.length === 0) && (
                <p className="text-[#5A5A7A] text-xs">No issues detected</p>
              )}
            </div>
          </Card>

          {/* Business intel */}
          <Card>
            <h3 className="font-display font-bold text-sm mb-3">Business Intel</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[#5A5A7A] text-xs">Rating</p>
                <p className="flex items-center gap-1">{lead.google_rating || 'N/A'} <Star size={12} className="text-yellow-400" /></p>
              </div>
              <div>
                <p className="text-[#5A5A7A] text-xs">Reviews</p>
                <p>{lead.review_count || 0}</p>
              </div>
              <div>
                <p className="text-[#5A5A7A] text-xs">Website</p>
                <p>{lead.has_website ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-[#5A5A7A] text-xs">GMB</p>
                <p>{lead.has_gmb ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-4">
          {/* AI Analysis */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <Sparkles size={14} className="text-violet" /> AI Analysis
              </h3>
              <Button
                variant="secondary"
                className="text-xs"
                disabled={analyzeLead.isPending}
                onClick={() => analyzeLead.mutate({ lead_id: id }, { onSuccess: (d) => setAiAnalysis(d) })}
              >
                <Sparkles size={12} /> {analyzeLead.isPending ? 'Analyzing...' : aiAnalysis ? 'Refresh' : 'Analyze'}
              </Button>
            </div>
            {aiAnalysis ? (
              <div className="space-y-3 text-sm">
                <p className="text-[#E8E8F0]">{aiAnalysis.summary}</p>
                {aiAnalysis.weaknesses?.length > 0 && (
                  <div>
                    <p className="text-coral text-xs font-mono mb-1">Weaknesses</p>
                    <ul className="list-disc list-inside text-[#E8E8F0]/70 text-xs space-y-0.5">
                      {aiAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
                {aiAnalysis.recommendations?.length > 0 && (
                  <div>
                    <p className="text-mint text-xs font-mono mb-1">Recommendations</p>
                    <ul className="list-disc list-inside text-[#E8E8F0]/70 text-xs space-y-0.5">
                      {aiAnalysis.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
                {aiAnalysis.estimated_revenue_impact && (
                  <p className="text-xs text-violet">Revenue Impact: {aiAnalysis.estimated_revenue_impact}</p>
                )}
              </div>
            ) : (
              <p className="text-[#5A5A7A] text-xs">Click Analyze to get AI-powered insights</p>
            )}
          </Card>

          {/* AI Call Script */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <PhoneCall size={14} className="text-mint" /> AI Call Script
              </h3>
              <Button
                variant="secondary"
                className="text-xs"
                disabled={generateScript.isPending}
                onClick={() => generateScript.mutate({ lead_id: id }, { onSuccess: (d) => setAiScript(d) })}
              >
                <Sparkles size={12} /> {generateScript.isPending ? 'Writing...' : aiScript ? 'Regenerate' : 'Generate'}
              </Button>
            </div>
            {aiScript ? (
              <div className="space-y-2 text-sm">
                {aiScript.opening && <div><p className="text-mint text-xs font-mono">Opening</p><p className="text-[#E8E8F0]/80 text-xs">{aiScript.opening}</p></div>}
                {aiScript.pain_point && <div><p className="text-coral text-xs font-mono">Pain Point</p><p className="text-[#E8E8F0]/80 text-xs">{aiScript.pain_point}</p></div>}
                {aiScript.value_prop && <div><p className="text-violet text-xs font-mono">Value Prop</p><p className="text-[#E8E8F0]/80 text-xs">{aiScript.value_prop}</p></div>}
                {aiScript.close && <div><p className="text-yellow-400 text-xs font-mono">Close</p><p className="text-[#E8E8F0]/80 text-xs">{aiScript.close}</p></div>}
              </div>
            ) : (
              <p className="text-[#5A5A7A] text-xs">Click Generate to create an AI call script</p>
            )}
          </Card>

          {/* Outreach Timeline */}
          <Card>
            <h3 className="font-display font-bold text-sm mb-3">Outreach Timeline</h3>
            <OutreachTimeline logs={logs || []} />
          </Card>

          {/* Notes */}
          <Card>
            <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
              <StickyNote size={14} /> Notes
            </h3>
            {lead.notes && (
              <p className="text-sm text-[#E8E8F0]/80 whitespace-pre-wrap mb-3">{lead.notes}</p>
            )}
            <div className="flex gap-2">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-[#E8E8F0] outline-none focus:border-mint/40"
              />
              <Button variant="secondary" className="text-xs" onClick={handleAddNote}>Add</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Email modal */}
      <Modal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} title="Send Email">
        <EmailComposer lead={lead} onSend={handleSendEmail} />
      </Modal>
    </div>
  )
}

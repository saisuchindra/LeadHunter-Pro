import { useState } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { replaceVariables } from '../../utils/templateEngine'
import { useGenerateEmail } from '../../hooks/useAI'
import { Send, Save, Clock, Sparkles } from 'lucide-react'

const defaultTemplates = [
  {
    id: 'no_website',
    name: 'No Website',
    subject: 'Quick question for {business_name}',
    body: `<p>Hi there,</p>
<p>I came across <strong>{business_name}</strong> in {city} and noticed you don't seem to have a website yet.</p>
<p>In 2026, over 80% of customers search online before visiting a local business. A professional website could help you reach more customers and grow your business.</p>
<p>I specialize in building modern, fast websites for local businesses like yours. Would you be open to a quick 10-minute call this week to discuss how I can help?</p>
<p>Best regards</p>`,
  },
  {
    id: 'weak_seo',
    name: 'Weak SEO',
    subject: 'Helping {business_name} get found online',
    body: `<p>Hi,</p>
<p>I was looking at your online presence for <strong>{business_name}</strong> and noticed some opportunities to improve your visibility on Google.</p>
<p>A few quick wins could help you rank higher and attract more local customers in {city}.</p>
<p>Would you be interested in a free audit of your online presence? No strings attached.</p>
<p>Looking forward to hearing from you!</p>`,
  },
  {
    id: 'no_gmb',
    name: 'No Google Maps',
    subject: '{business_name} — missing from Google Maps?',
    body: `<p>Hi,</p>
<p>I searched for <strong>{business_name}</strong> on Google Maps and couldn't find a complete listing.</p>
<p>Did you know that businesses with a complete Google Business Profile get 7x more clicks? I can help you set up and optimize your listing for free as a trial.</p>
<p>Let me know if you'd like to chat!</p>`,
  },
]

export default function EmailComposer({ lead, onSend, templates = [] }) {
  const allTemplates = [...defaultTemplates, ...templates]
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const generateEmail = useGenerateEmail()

  const handleAIGenerate = () => {
    if (!lead?.id) return
    generateEmail.mutate({ lead_id: lead.id, tone: 'professional' }, {
      onSuccess: (data) => {
        setSubject(data.subject || '')
        setBody(data.body || '')
        setSelectedTemplate('')
      },
    })
  }

  const variables = {
    business_name: lead?.business_name || '',
    city: lead?.city || '',
    owner_name: '',
    issue_type: (lead?.score_reasons || [])[0] || '',
  }

  const handleTemplateChange = (id) => {
    setSelectedTemplate(id)
    const tpl = allTemplates.find((t) => t.id === id)
    if (tpl) {
      setSubject(tpl.subject)
      setBody(tpl.body)
    }
  }

  const previewSubject = replaceVariables(subject, variables)
  const previewBody = replaceVariables(body, variables)

  const inputClass =
    'bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-[#E8E8F0] outline-none focus:border-mint/40 transition-colors w-full'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <Card>
        <h3 className="font-display font-bold mb-4">Compose Email</h3>

        <div className="space-y-4">
          <div>
            <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Template</label>
            <select value={selectedTemplate} onChange={(e) => handleTemplateChange(e.target.value)} className={inputClass}>
              <option value="">Custom</option>
              {allTemplates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className={inputClass + ' resize-y'}
            />
          </div>

          <div className="text-[#5A5A7A] text-xs font-mono">
            Variables: {'{business_name}'} {'{city}'} {'{owner_name}'} {'{issue_type}'}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" onClick={() => onSend?.({ subject, body, template_id: selectedTemplate || null })}>
              <Send size={14} /> Send Now
            </Button>
            <Button variant="secondary" onClick={handleAIGenerate} disabled={generateEmail.isPending}>
              <Sparkles size={14} /> {generateEmail.isPending ? 'Writing...' : 'AI Generate'}
            </Button>
            <Button variant="secondary">
              <Clock size={14} /> Schedule
            </Button>
            <Button variant="ghost">
              <Save size={14} /> Save Template
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card>
        <h3 className="font-display font-bold mb-4">Preview</h3>
        <div className="bg-white/[0.02] rounded-lg p-4">
          <p className="text-xs text-[#5A5A7A] mb-1">To: {lead?.email || 'N/A'}</p>
          <p className="text-sm font-medium mb-3 pb-3 border-b border-white/[0.07]">{previewSubject || 'Subject...'}</p>
          <div
            className="text-sm text-[#E8E8F0] leading-relaxed prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: previewBody || '<p class="text-[#5A5A7A]">Email body preview...</p>' }}
          />
        </div>
      </Card>
    </div>
  )
}

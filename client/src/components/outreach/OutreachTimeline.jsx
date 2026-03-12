import { Mail, Phone, MessageSquare, Clock } from 'lucide-react'
import { format } from 'date-fns'
import clsx from 'clsx'

const typeIcons = {
  email: Mail,
  call: Phone,
  whatsapp: MessageSquare,
  note: Clock,
}

const statusColors = {
  sent: 'text-violet',
  delivered: 'text-blue-400',
  opened: 'text-yellow-400',
  replied: 'text-mint',
  failed: 'text-coral',
  completed: 'text-mint',
}

export default function OutreachTimeline({ logs = [] }) {
  if (logs.length === 0) {
    return <p className="text-[#5A5A7A] text-sm py-4">No outreach activity yet.</p>
  }

  return (
    <div className="space-y-0">
      {logs.map((log, i) => {
        const Icon = typeIcons[log.type] || Mail
        const color = statusColors[log.status] || 'text-[#5A5A7A]'

        return (
          <div key={log.id} className="flex gap-3">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/[0.03]', color)}>
                <Icon size={14} />
              </div>
              {i < logs.length - 1 && <div className="w-px flex-1 bg-white/[0.07] my-1" />}
            </div>

            {/* Content */}
            <div className="pb-4">
              <p className="text-sm font-medium capitalize">
                {log.type} {log.direction === 'inbound' ? 'received' : 'sent'}
                {log.status === 'replied' && <span className="text-mint ml-1">✓</span>}
              </p>
              {log.subject && <p className="text-xs text-[#5A5A7A] mt-0.5">{log.subject}</p>}
              <p className="text-xs text-[#5A5A7A] mt-0.5">
                {format(new Date(log.created_at), 'MMM d, yyyy · h:mm a')}
                {log.call_duration && ` · ${Math.floor(log.call_duration / 60)}m ${log.call_duration % 60}s`}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

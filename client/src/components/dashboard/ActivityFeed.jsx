import { format } from 'date-fns'
import { Mail, Phone, Search } from 'lucide-react'
import Card from '../ui/Card'

const typeIcons = {
  email: { icon: Mail, color: '#7B61FF' },
  call: { icon: Phone, color: '#00FFB2' },
  search: { icon: Search, color: '#FFB347' },
}

export default function ActivityFeed({ activities = [] }) {
  return (
    <Card className="h-full">
      <h3 className="font-display font-bold text-sm mb-4">Recent Activity</h3>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {activities.length === 0 && (
          <p className="text-[#5A5A7A] text-xs">No recent activity</p>
        )}
        {activities.map((item) => {
          const typeInfo = typeIcons[item.type] || typeIcons.email
          const Icon = typeInfo.icon
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${typeInfo.color}15`, color: typeInfo.color }}
              >
                <Icon size={12} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#E8E8F0] truncate">
                  <span className="capitalize">{item.type}</span>
                  {item.direction === 'outbound' ? ' sent to ' : ' from '}
                  <span className="text-mint">{item.business_name}</span>
                </p>
                <p className="text-[10px] text-[#5A5A7A] mt-0.5">
                  {item.city} · {format(new Date(item.created_at), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

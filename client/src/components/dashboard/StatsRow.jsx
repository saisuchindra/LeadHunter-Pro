import { Users, Send, MessageSquare, TrendingUp } from 'lucide-react'
import StatCard from '../ui/StatCard'

export default function StatsRow({ stats }) {
  const cards = [
    { label: 'Total Leads', value: parseInt(stats?.total) || 0, delta: `+${stats?.today || 0} today`, icon: Users, color: '#7B61FF' },
    { label: 'Contacted', value: parseInt(stats?.contacted) || 0, delta: stats?.total ? `${Math.round((stats.contacted / stats.total) * 100)}% rate` : '0%', icon: Send, color: '#00FFB2' },
    { label: 'Replied', value: parseInt(stats?.replied) || 0, delta: stats?.contacted ? `${Math.round((stats.replied / stats.contacted) * 100)}% reply` : '0%', icon: MessageSquare, color: '#FFB347' },
    { label: 'Converted', value: parseInt(stats?.converted) || 0, delta: '', icon: TrendingUp, color: '#FF4D6D' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <StatCard key={c.label} {...c} />
      ))}
    </div>
  )
}

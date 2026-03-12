import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAnalytics, useDailyLeads, useCategoryBreakdown, useActivityFeed } from '../hooks/useOutreach'
import { useLeadsList } from '../hooks/useLeads'
import StatsRow from '../components/dashboard/StatsRow'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import PipelineBoard from '../components/dashboard/PipelineBoard'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'

const COLORS = ['#7B61FF', '#00FFB2', '#FF4D6D', '#FFB347', '#3B82F6', '#EC4899']

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useAnalytics()
  const { data: daily } = useDailyLeads(14)
  const { data: categories } = useCategoryBreakdown()
  const { data: activity } = useActivityFeed()
  const { data: leadsData } = useLeadsList({ limit: 200 })

  if (statsLoading) {
    return <div className="flex items-center justify-center h-64"><Spinner /></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl">Dashboard</h1>

      <StatsRow stats={stats} />

      {/* Pipeline */}
      <Card>
        <h3 className="font-display font-bold text-sm mb-4">Pipeline</h3>
        <PipelineBoard leads={leadsData?.leads || []} />
      </Card>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart */}
        <Card className="lg:col-span-1">
          <h3 className="font-display font-bold text-sm mb-4">Leads Found (14 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={daily || []}>
              <defs>
                <linearGradient id="mintGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FFB2" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00FFB2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5A5A7A' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#5A5A7A' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="#00FFB2" fill="url(#mintGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Donut chart */}
        <Card className="lg:col-span-1">
          <h3 className="font-display font-bold text-sm mb-4">Leads by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categories || []}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {(categories || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {(categories || []).map((c, i) => (
              <span key={c.category} className="text-[10px] font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {c.category}
              </span>
            ))}
          </div>
        </Card>

        {/* Activity feed */}
        <ActivityFeed activities={activity || []} />
      </div>
    </div>
  )
}

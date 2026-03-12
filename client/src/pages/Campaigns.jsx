import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Plus, Play, Pause, MoreHorizontal } from 'lucide-react'
import { useCampaigns, useCreateCampaign, useActivateCampaign, usePauseCampaign } from '../hooks/useOutreach'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'

const statusColors = {
  draft: 'text-[#5A5A7A]',
  active: 'text-mint',
  paused: 'text-yellow-400',
  completed: 'text-violet',
}

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns()
  const createCampaign = useCreateCampaign()
  const activateCampaign = useActivateCampaign()
  const pauseCampaign = usePauseCampaign()
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('email')

  const handleCreate = () => {
    if (!name.trim()) return
    createCampaign.mutate({ name, type }, {
      onSuccess: () => { setCreateOpen(false); setName(''); toast.success('Campaign created'); },
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Spinner /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl">Campaigns</h1>
        <Button variant="primary" className="text-xs" onClick={() => setCreateOpen(true)}>
          <Plus size={14} /> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(campaigns || []).map((c) => {
          const stats = c.stats || { sent: 0, opened: 0, replied: 0 }
          return (
            <Card key={c.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-sm">{c.name}</h3>
                  <p className="text-xs text-[#5A5A7A] capitalize">{c.type} campaign</p>
                </div>
                <Badge label={c.status} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div>
                  <p className="text-lg font-display font-bold text-mint">{stats.sent}</p>
                  <p className="text-[10px] text-[#5A5A7A] font-mono">Sent</p>
                </div>
                <div>
                  <p className="text-lg font-display font-bold text-violet">{stats.opened}</p>
                  <p className="text-[10px] text-[#5A5A7A] font-mono">Opened</p>
                </div>
                <div>
                  <p className="text-lg font-display font-bold text-coral">{stats.replied}</p>
                  <p className="text-[10px] text-[#5A5A7A] font-mono">Replied</p>
                </div>
              </div>

              <div className="flex gap-2">
                {c.status === 'draft' || c.status === 'paused' ? (
                  <Button variant="primary" className="text-xs flex-1" onClick={() => activateCampaign.mutate(c.id)}>
                    <Play size={12} /> Activate
                  </Button>
                ) : c.status === 'active' ? (
                  <Button variant="secondary" className="text-xs flex-1" onClick={() => pauseCampaign.mutate(c.id)}>
                    <Pause size={12} /> Pause
                  </Button>
                ) : null}
              </div>
            </Card>
          )
        })}

        {(!campaigns || campaigns.length === 0) && (
          <Card className="col-span-full text-center py-12">
            <p className="text-[#5A5A7A] text-sm mb-3">No campaigns yet</p>
            <Button variant="primary" className="text-xs" onClick={() => setCreateOpen(true)}>
              <Plus size={14} /> Create your first campaign
            </Button>
          </Card>
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Campaign">
        <div className="space-y-4">
          <div>
            <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Campaign Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mumbai Cafes Q1"
              className="bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-[#E8E8F0] outline-none focus:border-mint/40 w-full"
            />
          </div>
          <div>
            <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-[#E8E8F0] outline-none w-full"
            >
              <option value="email">Email</option>
              <option value="call">Call</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <Button variant="primary" onClick={handleCreate} disabled={!name.trim()}>Create Campaign</Button>
        </div>
      </Modal>
    </div>
  )
}

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { User, Mail, Key, CreditCard, Save } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Settings() {
  const [profile, setProfile] = useState({ name: '', email: '', agency: '' })
  const [smtp, setSmtp] = useState({ host: '', port: '587', user: '', pass: '' })

  const handleProfileSave = (e) => {
    e.preventDefault()
    toast.success('Profile updated')
  }

  const handleSmtpSave = (e) => {
    e.preventDefault()
    toast.success('SMTP settings saved')
  }

  const inputClass =
    'bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-[#E8E8F0] outline-none focus:border-mint/40 w-full'

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display font-bold text-2xl">Settings</h1>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-mint" />
          <h2 className="font-display font-bold text-sm">Profile</h2>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-3">
          <div>
            <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Full Name</label>
            <input className={inputClass} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Email</label>
            <input className={inputClass} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div>
            <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Agency Name</label>
            <input className={inputClass} value={profile.agency} onChange={(e) => setProfile({ ...profile, agency: e.target.value })} />
          </div>
          <Button type="submit" variant="primary" className="text-xs"><Save size={12} /> Save Profile</Button>
        </form>
      </Card>

      {/* SMTP */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Mail size={16} className="text-violet" />
          <h2 className="font-display font-bold text-sm">SMTP Configuration</h2>
        </div>
        <form onSubmit={handleSmtpSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#5A5A7A] text-xs font-mono block mb-1">SMTP Host</label>
              <input className={inputClass} placeholder="smtp.gmail.com" value={smtp.host} onChange={(e) => setSmtp({ ...smtp, host: e.target.value })} />
            </div>
            <div>
              <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Port</label>
              <input className={inputClass} value={smtp.port} onChange={(e) => setSmtp({ ...smtp, port: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Username</label>
            <input className={inputClass} value={smtp.user} onChange={(e) => setSmtp({ ...smtp, user: e.target.value })} />
          </div>
          <div>
            <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Password</label>
            <input className={inputClass} type="password" value={smtp.pass} onChange={(e) => setSmtp({ ...smtp, pass: e.target.value })} />
          </div>
          <Button type="submit" variant="primary" className="text-xs"><Save size={12} /> Save SMTP</Button>
        </form>
      </Card>

      {/* Plan */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={16} className="text-coral" />
          <h2 className="font-display font-bold text-sm">Subscription</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-display font-bold text-mint">Free Plan</p>
            <p className="text-xs text-[#5A5A7A]">10 searches / day &bull; 50 emails / month</p>
          </div>
          <Button variant="secondary" className="text-xs">Upgrade</Button>
        </div>
      </Card>

      {/* API Keys */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Key size={16} className="text-yellow-400" />
          <h2 className="font-display font-bold text-sm">API Keys</h2>
        </div>
        <p className="text-xs text-[#5A5A7A] mb-3">Google Places API key is configured server-side via environment variables.</p>
        <code className="text-xs text-mint/60 font-mono bg-white/[0.02] px-3 py-2 rounded-lg block overflow-x-auto">
          GOOGLE_API_KEY=your_key_here
        </code>
      </Card>
    </div>
  )
}

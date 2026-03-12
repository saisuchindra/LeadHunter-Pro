import { Search, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function TopBar() {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 border-b border-white/[0.07] flex items-center justify-between px-6 bg-[#0A0A0F]/60 backdrop-blur-xl">
      {/* Search */}
      <div className="relative w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A7A]" />
        <input
          type="text"
          placeholder="Search leads, campaigns..."
          className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg pl-10 pr-4 py-2 text-sm text-[#E8E8F0] placeholder-[#5A5A7A] outline-none focus:border-mint/40 transition-colors"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-[#5A5A7A] hover:text-[#E8E8F0] transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-coral rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet/20 flex items-center justify-center text-violet text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm text-[#E8E8F0] hidden sm:block">{user?.name || 'User'}</span>
          <button onClick={logout} className="p-1.5 text-[#5A5A7A] hover:text-coral transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}

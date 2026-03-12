import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Radar, Database, Mail, GitBranch, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react'
import useUiStore from '../../store/uiSlice'
import clsx from 'clsx'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Radar, label: 'Lead Search', path: '/search', badge: 'NEW' },
  { icon: Database, label: 'All Leads', path: '/leads' },
  { icon: Mail, label: 'Outreach Hub', path: '/outreach' },
  { icon: GitBranch, label: 'Campaigns', path: '/campaigns' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggle = useUiStore((s) => s.toggleSidebar)
  const location = useLocation()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r border-white/[0.07] bg-[#0A0A0F]/80 backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.07]">
        <div className="w-8 h-8 rounded-lg bg-mint/20 flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-mint text-sm">LH</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-display font-bold text-sm whitespace-nowrap overflow-hidden"
            >
              LeadHunter
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group',
                active
                  ? 'bg-mint/10 text-mint'
                  : 'text-[#5A5A7A] hover:text-[#E8E8F0] hover:bg-white/[0.03]'
              )}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-mint rounded-r"
                />
              )}
              <Icon size={20} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && !collapsed && (
                <span className="ml-auto text-[10px] font-mono bg-mint/20 text-mint px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="flex items-center justify-center h-12 border-t border-white/[0.07] text-[#5A5A7A] hover:text-[#E8E8F0] transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </motion.aside>
  )
}

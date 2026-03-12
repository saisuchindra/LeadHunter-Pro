import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import useUiStore from '../../store/uiSlice'

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10 },
}

export default function Layout() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        <TopBar />
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LeadSearch from './pages/LeadSearch'
import LeadDatabase from './pages/LeadDatabase'
import LeadDetail from './pages/LeadDetail'
import OutreachHub from './pages/OutreachHub'
import Campaigns from './pages/Campaigns'
import Settings from './pages/Settings'
import Spinner from './components/ui/Spinner'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-dark flex items-center justify-center"><Spinner /></div>
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/search" element={<LeadSearch />} />
        <Route path="/leads" element={<LeadDatabase />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
        <Route path="/outreach" element={<OutreachHub />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

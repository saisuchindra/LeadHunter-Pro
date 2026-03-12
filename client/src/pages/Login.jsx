import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'

export default function Login() {
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isRegister) {
        await register(email, password, name)
        toast.success('Account created!')
      } else {
        await login(email, password)
        toast.success('Welcome back!')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="fixed inset-0 grid-bg opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-mint/10 border border-mint/20 mb-4">
            <span className="text-mint font-display font-bold text-xl">LH</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#E8E8F0]">LeadHunter Pro</h1>
          <p className="text-[#5A5A7A] text-sm mt-1">Cold outreach intelligence platform</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-[#E8E8F0] mb-5">
            {isRegister ? 'Create Account' : 'Sign In'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-[#E8E8F0] outline-none focus:border-mint/40 w-full transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@agency.com"
                className="bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-[#E8E8F0] outline-none focus:border-mint/40 w-full transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-[#5A5A7A] text-xs font-mono block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-[#E8E8F0] outline-none focus:border-mint/40 w-full transition-colors"
                required
                minLength={6}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-mint text-dark font-display font-bold text-sm py-2.5 rounded-lg hover:bg-mint/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-[#5A5A7A] text-xs mt-5">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-mint hover:underline"
            >
              {isRegister ? 'Sign In' : 'Create one'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

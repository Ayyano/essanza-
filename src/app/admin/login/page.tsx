'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email address zaroori hai')
      return
    }
    if (!password.trim()) {
      setError('Password zaroori hai')
      return
    }

    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)

    if (result.error) {
      if (result.error.includes('Invalid login credentials')) {
        setError('Email ya password galat hai')
      } else {
        setError('Kuch galat ho gaya, dobara koshish karein')
      }
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#2D2D2D] rounded-lg border border-[#3D3D3D] p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-heading font-semibold text-[#C4A97D] tracking-wider">
                ESSANZA
              </h1>
            </Link>
            <p className="text-[#D4C4AE] text-sm mt-2 font-body tracking-wide uppercase">
              Admin Panel
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-heading text-white mb-6 text-center">
              Sign in to Admin
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-[#D4C4AE] mb-2 font-body">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="essenza0055@gmail.com"
                    className="w-full bg-[#1A1A1A] border border-[#3D3D3D] rounded-md py-2.5 pl-10 pr-3 text-white text-sm placeholder-[#6B6B6B] focus:outline-none focus:border-[#C4A97D] focus:ring-1 focus:ring-[#C4A97D]/30 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#D4C4AE] mb-2 font-body">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1A1A1A] border border-[#3D3D3D] rounded-md py-2.5 pl-10 pr-10 text-white text-sm placeholder-[#6B6B6B] focus:outline-none focus:border-[#C4A97D] focus:ring-1 focus:ring-[#C4A97D]/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#D4C4AE] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  'w-full py-2.5 rounded-md text-sm font-medium transition-colors',
                  loading
                    ? 'bg-[#C4A97D]/50 text-white/70 cursor-not-allowed'
                    : 'bg-[#C4A97D] text-[#1A1A1A] hover:bg-[#D4C4AE]'
                )}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

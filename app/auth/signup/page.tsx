'use client'

import { useState } from 'react'
import { Building2, Users, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'admin',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await signup(formData.name, formData.email, formData.password, formData.role)
      setSuccess(true)
      setTimeout(() => {
        router.push(formData.role === 'admin' ? '/admin' : '/dashboard')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card padding="lg" className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 size={32} className="text-green-400" />
          </motion.div>
          <h1 className="text-xl font-semibold mb-1">Account created</h1>
          <p className="text-sm text-text-secondary">Redirecting to your dashboard…</p>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
    <Card padding="lg">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1">Create account</h1>
        <p className="text-sm text-text-secondary">Join the citizen safety network</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {([
          { value: 'user' as const, label: 'Citizen', icon: Users },
          { value: 'admin' as const, label: 'Admin', icon: Building2 },
        ]).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: value }))}
            className={cn(
              'flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors',
              formData.role === value
                ? 'bg-accent-subtle border-accent/40 text-red-200'
                : 'bg-surface-overlay border-surface-border text-text-secondary hover:border-slate-600'
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-accent-subtle border border-red-500/30 rounded-lg text-red-300 text-sm animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm text-text-secondary mb-1.5">Full name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Your name"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-text-secondary mb-1.5">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="input-field pr-11"
              placeholder="Min 6 characters"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary text-xs"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm text-text-secondary mb-1.5">Confirm password</label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Confirm password"
            disabled={isLoading}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-accent hover:text-accent-hover font-medium">Sign in</Link>
      </p>
    </Card>
    </motion.div>
  )
}

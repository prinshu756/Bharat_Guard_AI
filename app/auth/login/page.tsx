'use client'

import { useState } from 'react'
import { Building2, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password, role)
      router.push(role === 'admin' ? '/admin' : '/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <Card padding="lg" className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-text-secondary">Sign in to your dashboard</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {([
          { value: 'user' as const, label: 'Citizen', icon: Users },
          { value: 'admin' as const, label: 'Admin', icon: Building2 },
        ]).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={cn(
              'flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors',
              role === value
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
          <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
            placeholder="priya@citizen.in"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-text-secondary mb-1.5">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field pr-11"
              placeholder="••••••••"
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

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-text-muted">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-accent hover:text-accent-hover font-medium">Sign up</Link>
      </p>

      <details className="mt-6">
        <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary">Demo credentials</summary>
        <div className="mt-3 p-3 bg-surface-overlay rounded-lg text-xs space-y-1.5 text-text-secondary">
          <p>Citizen: <span className="font-mono text-text-primary">priya@citizen.in</span></p>
          <p>Admin: <span className="font-mono text-text-primary">rajesh@admin.in</span></p>
          <p>Password: <span className="font-mono text-text-primary">123456</span></p>
        </div>
      </details>
    </Card>
  )
}

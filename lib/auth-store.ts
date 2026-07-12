'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type UserRole } from '@/lib/types'

interface AuthState {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    avatar?: string
  } | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: AuthState['user']) => void
  login: (email: string, password: string, role: UserRole) => Promise<void>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  setLoading: (loading: boolean) => void
}

const demoUsers = [
  { id: '1', name: 'Priya Sharma', email: 'priya@citizen.in', role: 'user' as UserRole, password: '123456' },
  { id: '2', name: 'Rajesh Kumar', email: 'rajesh@admin.in', role: 'admin' as UserRole, password: '123456' },
  { id: '3', name: 'Amit Patel', email: 'amit@citizen.in', role: 'user' as UserRole, password: '123456' },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email, password, role) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 800))
        const user = demoUsers.find((u) => u.email === email && u.password === password && u.role === role)
        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false })
        } else {
          set({ isLoading: false })
          throw new Error('Invalid credentials or role mismatch')
        }
      },

      signup: async (name, email, password, role) => {
        set({ isLoading: true })
        await new Promise((r) => setTimeout(r, 800))
        const newUser = { id: String(Date.now()), name, email, role, password }
        demoUsers.push(newUser)
        const { password: _, ...userWithoutPassword } = newUser
        set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false })
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'bharat-guardian-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
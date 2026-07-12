'use client'

import { ReactNode, useState } from 'react'
import { MapPin, AlertTriangle, Navigation, Shield, Building2, Users, LogOut, Bell, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import Logo from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
  userRole: 'user' | 'admin'
}

const userNavItems = [
  { href: '/dashboard', label: 'Map', icon: MapPin },
  { href: '/dashboard/report', label: 'Report', icon: AlertTriangle },
  { href: '/dashboard/navigate', label: 'Navigate', icon: Navigation },
  { href: '/dashboard/sos', label: 'SOS', icon: Shield, critical: true },
]

const adminNavItems = [
  { href: '/admin', label: 'Complaints', icon: Shield },
  { href: '/admin/resources', label: 'Resources', icon: Building2 },
  { href: '/admin/teams', label: 'Rescue Teams', icon: Users },
  { href: '/admin/disasters', label: 'Disasters', icon: AlertTriangle },
]

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const navItems = userRole === 'admin' ? adminNavItems : userNavItems

  const handleLogout = () => {
    logout()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-raised border-r border-surface-border flex flex-col transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <Link href={userRole === 'admin' ? '/admin' : '/dashboard'} onClick={() => setSidebarOpen(false)}>
            <Logo size="sm" />
          </Link>
          <button
            type="button"
            className="lg:hidden btn-ghost p-1.5"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent-subtle text-red-200'
                    : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary',
                  item.critical && !isActive && 'text-red-300/80'
                )}
              >
                <item.icon size={18} className={cn(item.critical && 'text-accent')} />
                <span className="flex-1 truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-surface-border">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="w-9 h-9 bg-surface-overlay rounded-lg flex items-center justify-center text-sm font-semibold text-accent">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-text-muted capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-overlay hover:text-accent transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-surface-border safe-top">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            <button
              type="button"
              className="lg:hidden btn-ghost p-2"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="relative btn-ghost p-2"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </button>

              <div className="hidden lg:flex items-center gap-2 ml-2 pl-2 border-l border-surface-border">
                <div className="w-8 h-8 bg-surface-overlay rounded-lg flex items-center justify-center text-xs font-semibold text-accent">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        {notificationsOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} aria-hidden />
            <div className="fixed top-14 right-4 lg:right-6 z-50 w-[min(20rem,calc(100vw-2rem))] card shadow-elevated overflow-hidden animate-fade-in">
              <div className="p-3 border-b border-surface-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <button type="button" onClick={() => setNotificationsOpen(false)} className="btn-ghost p-1">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-surface-border">
                {[
                  { title: 'Flood alert — Rajwada', desc: 'Critical flooding reported', time: '2m', type: 'critical' as const },
                  { title: 'Report verified', desc: 'Your pothole report confirmed', time: '15m', type: 'success' as const },
                  { title: 'Route updated', desc: 'New safe route available', time: '1h', type: 'info' as const },
                ].map((notif) => (
                  <div key={notif.title} className="p-3 hover:bg-surface-overlay/50">
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{notif.desc}</p>
                    <p className="text-[10px] text-text-muted mt-1">{notif.time} ago</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex-1 p-4 lg:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  )
}

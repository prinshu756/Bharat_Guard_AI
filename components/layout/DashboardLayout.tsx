'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { AlertTriangle, Bell, Building2, LogOut, MapPin, Menu, Navigation, Shield, Users, X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { useAppStore } from '@/lib/store'
import Logo from '@/components/ui/Logo'
import { AdminPageSkeleton, ContentPageSkeleton, DashboardMapSkeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
  userRole: 'user' | 'admin'
}

type NavItem = {
  href: string
  label: string
  icon: typeof MapPin
  critical?: boolean
}

const userNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Live map', icon: MapPin },
  { href: '/dashboard/report', label: 'Report issue', icon: AlertTriangle },
  { href: '/dashboard/navigate', label: 'Navigate', icon: Navigation },
  { href: '/dashboard/sos', label: 'Emergency SOS', icon: Shield, critical: true },
]

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Complaints', icon: Shield },
  { href: '/admin/resources', label: 'Resources', icon: Building2 },
  { href: '/admin/teams', label: 'Rescue teams', icon: Users },
  { href: '/admin/disasters', label: 'Disasters', icon: AlertTriangle },
]

const notifications = [
  { title: 'Flood alert - Rajwada', desc: 'Critical flooding reported', time: '2m ago', tone: 'bg-red-400' },
  { title: 'Report verified', desc: 'A pothole report was confirmed', time: '15m ago', tone: 'bg-green-400' },
  { title: 'Route updated', desc: 'A safer route is available', time: '1h ago', tone: 'bg-blue-400' },
]

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const isLoading = useAppStore((state) => state.isLoading)
  const loadMockData = useAppStore((state) => state.loadMockData)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    if (isLoading) void loadMockData()
  }, [isLoading, loadMockData])

  const navItems = userRole === 'admin' ? adminNavItems : userNavItems
  const activeItem = navItems.find((item) => pathname === item.href)

  const handleLogout = () => {
    logout()
    router.push('/')
    router.refresh()
  }

  const loadingContent = pathname === '/dashboard'
    ? <DashboardMapSkeleton />
    : userRole === 'admin'
      ? <AdminPageSkeleton />
      : <ContentPageSkeleton />

  return (
    <div className="flex min-h-screen bg-surface">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-slate-950/70 backdrop-blur-[2px] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          />
        )}
      </AnimatePresence>

      <motion.aside
        id="dashboard-navigation"
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-surface-border bg-surface-raised shadow-elevated lg:!translate-x-0 lg:static lg:shadow-none'
        )}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex h-16 items-center justify-between border-b border-surface-border px-4 safe-top">
          <Link href={userRole === 'admin' ? '/admin' : '/dashboard'} onClick={() => setSidebarOpen(false)} aria-label="Dashboard home">
            <Logo size="sm" />
          </Link>
          <button
            type="button"
            className="btn-ghost min-h-11 min-w-11 p-2 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-3 pt-5">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            {userRole === 'admin' ? 'Response workspace' : 'Citizen workspace'}
          </p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'relative flex min-h-11 items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-[background-color,color] duration-150',
                  isActive
                    ? 'bg-accent-subtle text-red-100'
                    : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary',
                  item.critical && !isActive && 'text-red-200/85'
                )}
              >
                {isActive && <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-accent" />}
                <item.icon size={18} className={cn('shrink-0', item.critical ? 'text-accent' : isActive && 'text-red-300')} />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-surface-border p-3 safe-bottom">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-sm font-semibold text-red-200">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name || 'Your account'}</p>
              <p className="truncate text-xs capitalize text-text-muted">{user?.role || userRole}</p>
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="btn-ghost w-full justify-start px-3 text-text-secondary hover:text-red-200">
            <LogOut size={16} />Sign out
          </button>
        </div>
      </motion.aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-surface-border bg-surface/85 backdrop-blur-xl safe-top">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="btn-ghost min-h-11 min-w-11 p-2 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={sidebarOpen}
                aria-controls="dashboard-navigation"
              >
                <Menu size={20} />
              </button>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-semibold">{activeItem?.label || (userRole === 'admin' ? 'Response workspace' : 'Citizen workspace')}</p>
                <p className="text-xs text-text-muted">{userRole === 'admin' ? 'Operations overview' : 'Community safety network'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs text-green-300 md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />Operational
              </div>
              <button
                type="button"
                className="relative btn-ghost min-h-11 min-w-11 p-2"
                onClick={() => setNotificationsOpen((open) => !open)}
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                aria-controls="notifications-panel"
              >
                <Bell size={18} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-surface bg-accent" />
              </button>
              <div className="hidden items-center gap-2 border-l border-surface-border pl-3 lg:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-overlay text-xs font-semibold text-red-200">{user?.name?.charAt(0) || 'U'}</div>
                <span className="max-w-[10rem] truncate text-sm font-medium">{user?.name || 'Your account'}</span>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {notificationsOpen && (
            <>
              <motion.button
                key="notif-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                type="button" className="fixed inset-0 z-40 cursor-default" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"
              />
              <motion.section
                key="notif-panel"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                id="notifications-panel"
                className="fixed right-4 top-[4.5rem] z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-surface-border bg-surface-raised shadow-elevated sm:right-6"
                aria-label="Notifications"
              >
              <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
                <div><h2 className="text-sm font-semibold">Notifications</h2><p className="text-xs text-text-muted">Latest activity</p></div>
                <button type="button" onClick={() => setNotificationsOpen(false)} className="btn-ghost min-h-9 min-w-9 p-1.5" aria-label="Close notifications"><X size={16} /></button>
              </div>
              <div className="divide-y divide-surface-border">
                {notifications.map((notification) => (
                  <div key={notification.title} className="flex gap-3 px-4 py-3 transition-colors hover:bg-surface-overlay/60">
                    <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', notification.tone)} />
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{notification.title}</p><p className="mt-0.5 text-xs text-text-secondary">{notification.desc}</p></div>
                    <span className="shrink-0 text-[11px] text-text-muted">{notification.time}</span>
                  </div>
                ))}
              </div>
            </motion.section>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-auto">
          <div className="min-h-full p-4 sm:p-6 lg:p-8">
            {isLoading ? loadingContent : children}
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Shield,
  Navigation,
  AlertTriangle,
  Building2,
  Users,
  Layers,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Settings,
  ChevronDown,
  Radio,
  HelpCircle,
} from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
import { useState } from 'react'

interface NavbarProps {
  role: 'user' | 'admin'
}

export default function Navbar({ role }: NavbarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const userNavItems = [
    { href: '/dashboard', label: 'Map', icon: MapPin, active: pathname === '/dashboard' },
    { href: '/dashboard/report', label: 'Report', icon: Shield, active: pathname === '/dashboard/report' },
    { href: '/dashboard/navigate', label: 'Navigate', icon: Navigation, active: pathname === '/dashboard/navigate' },
    { href: '/dashboard/sos', label: 'SOS', icon: AlertTriangle, active: pathname === '/dashboard/sos' },
  ]

  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: Building2, active: pathname === '/admin' },
    { href: '/admin/complaints', label: 'Complaints', icon: Shield, active: pathname === '/admin/complaints' },
    { href: '/admin/resources', label: 'Resources', icon: Layers, active: pathname === '/admin/resources' },
    { href: '/admin/disaster', label: 'Disaster', icon: AlertTriangle, active: pathname === '/admin/disaster' },
    { href: '/admin/teams', label: 'Rescue Teams', icon: Users, active: pathname === '/admin/teams' },
  ]

  const navItems = role === 'admin' ? adminNavItems : userNavItems

  return (
    <>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse lg:hidden" />
              <span className="font-bold text-lg hidden sm:block">
                Bharat Guardian <span className="text-red-400">AI</span>
              </span>
              <span className="text-xs text-gray-500 hidden md:inline font-mono">Know·Report·Navigate·Rescue</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      item.active
                        ? 'bg-red-500/20 text-red-300'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side - Disaster Mode + User Menu */}
            <div className="flex items-center gap-3">
              {/* Disaster Mode Toggle */}
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all lg:hidden"
              >
                <Radio size={12} />
                Disaster
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors lg:hidden">
                <Bell size={20} className="text-gray-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <User size={16} className="text-red-400" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium truncate max-w-[120px]">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-lg py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mt-1 ${
                          user?.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {user?.role === 'admin' ? 'Administrator' : 'Citizen'}
                        </span>
                      </div>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 transition-colors"
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      <Link
                        href="/help"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 transition-colors"
                      >
                        <HelpCircle size={16} />
                        Help & Support
                      </Link>
                      <hr className="my-2 border-slate-800" />
                      <button
                        onClick={() => { logout(); setDropdownOpen(false) }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 transition-colors text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-gray-300" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-16 right-0 bottom-0 w-72 lg:hidden bg-slate-900 border-l border-slate-800 z-40 p-4 overflow-y-auto"
            >
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                        item.active
                          ? 'bg-red-500/20 text-red-300'
                          : 'text-gray-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  )
                })}
                <hr className="my-4 border-slate-800" />
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false) }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
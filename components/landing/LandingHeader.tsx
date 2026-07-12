'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Logo from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export default function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={cn('sticky top-0 z-40 border-b border-surface-border/80 bg-surface/85 backdrop-blur-xl safe-top transition-shadow duration-300', scrolled && 'shadow-elevated')}>
      <div className="page-container flex h-16 items-center justify-between">
        <Link href="/" aria-label="Bharat Guardian AI home" onClick={closeMenu}>
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          <a href="#capabilities" className="text-sm text-text-secondary transition-colors hover:text-text-primary">How it helps</a>
          <a href="#response" className="text-sm text-text-secondary transition-colors hover:text-text-primary">For responders</a>
          <Link href="/auth/login" className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">Sign in</Link>
          <Link href="/auth/signup" className="btn-primary min-h-9 px-4 py-2 text-xs">Create account</Link>
        </nav>

        <button
          type="button"
          className="btn-ghost min-h-11 min-w-11 p-2 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="landing-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <nav id="landing-menu" className="border-t border-surface-border bg-surface-raised px-4 py-3 md:hidden animate-fade-in" aria-label="Mobile navigation">
          <div className="page-container space-y-1 px-0">
            <a href="#capabilities" onClick={closeMenu} className="block rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-surface-overlay hover:text-text-primary">How it helps</a>
            <a href="#response" onClick={closeMenu} className="block rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-surface-overlay hover:text-text-primary">For responders</a>
            <Link href="/auth/login" onClick={closeMenu} className="block rounded-lg px-3 py-3 text-sm text-text-secondary hover:bg-surface-overlay hover:text-text-primary">Sign in</Link>
            <Link href="/auth/signup" onClick={closeMenu} className="btn-primary mt-2 w-full">Create account</Link>
          </div>
        </nav>
      )}
    </header>
  )
}

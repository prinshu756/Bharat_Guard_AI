import { ReactNode } from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Brand panel — desktop only */}
      <aside className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between border-r border-surface-border bg-surface-raised p-10">
        <Link href="/">
          <Logo size="lg" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold leading-snug mb-3">
            Public safety infrastructure for India
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Report road hazards, navigate around danger, and reach help fast during emergencies.
          </p>
        </div>
        <p className="text-xs text-text-muted">© Bharat Guardian AI</p>
      </aside>

      {/* Form area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden border-b border-surface-border bg-surface/90 backdrop-blur sticky top-0 z-40 safe-top">
          <div className="page-container flex h-14 items-center justify-between">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Home
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-12">
          <div className="w-full max-w-md animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  )
}

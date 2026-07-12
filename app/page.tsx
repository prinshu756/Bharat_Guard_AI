'use client'

import { MapPin, Shield, Navigation, AlertTriangle, ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const features = [
  {
    icon: MapPin,
    title: 'Road intelligence',
    desc: 'Live floods, potholes, traffic, and landslides verified by community reports.',
  },
  {
    icon: Shield,
    title: 'Verified reporting',
    desc: 'Photo, GPS, and voice notes auto-categorized with confidence scoring.',
  },
  {
    icon: Navigation,
    title: 'Safe navigation',
    desc: 'Routes scored for safety so you avoid hazards on the way.',
  },
  {
    icon: AlertTriangle,
    title: 'Disaster response',
    desc: 'One-tap SOS, rescue maps, shelters, and resources when it matters.',
  },
]

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface text-text-primary flex flex-col">
      <header className="sticky top-0 z-40 border-b border-surface-border bg-surface/90 backdrop-blur safe-top">
        <div className="page-container flex h-14 sm:h-16 items-center justify-between">
          <Link href="/">
            <Logo size="sm" />
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/auth/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Sign in
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </nav>

          <button
            type="button"
            className="sm:hidden btn-ghost p-2"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="sm:hidden border-t border-surface-border bg-surface-raised px-4 py-3 space-y-2 animate-fade-in">
            <Link
              href="/auth/login"
              className="block py-2 text-sm text-text-secondary"
              onClick={() => setMobileNavOpen(false)}
            >
              Sign in
            </Link>
            <Link href="/auth/signup" onClick={() => setMobileNavOpen(false)}>
              <Button className="w-full">Get started</Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <section className="page-container py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl animate-fade-in">
            <p className="text-sm font-medium text-accent mb-4">
              Emergency intelligence for India
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
              Report hazards. Navigate safely. Get help when it matters.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
              Real-time road alerts, civic reporting, and disaster response — one platform for citizens and responders.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start as citizen
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Admin portal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-surface-border bg-surface-raised/50 py-14 sm:py-16">
          <div className="page-container">
            <h2 className="text-xl sm:text-2xl font-semibold mb-8 sm:mb-10">
              What you can do
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature) => (
                <Card key={feature.title} className="hover:border-slate-600 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center mb-3">
                    <feature.icon size={20} className="text-accent" />
                  </div>
                  <h3 className="font-medium mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="page-container py-14 sm:py-16">
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <Card padding="lg" className="hover:border-accent/30 transition-colors">
              <h3 className="text-lg font-semibold mb-2">Citizen portal</h3>
              <p className="text-sm text-text-secondary mb-4">
                Report issues, view hazards, get safe routes, and send SOS alerts from your phone.
              </p>
              <Link href="/auth/login" className="text-sm text-accent hover:text-accent-hover font-medium">
                Sign in as citizen →
              </Link>
            </Card>
            <Card padding="lg" className="hover:border-accent/30 transition-colors">
              <h3 className="text-lg font-semibold mb-2">Admin dashboard</h3>
              <p className="text-sm text-text-secondary mb-4">
                Manage complaints, assign teams, coordinate rescue, and monitor disasters.
              </p>
              <Link href="/auth/login" className="text-sm text-accent hover:text-accent-hover font-medium">
                Sign in as admin →
              </Link>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-border bg-surface-raised py-8">
        <div className="page-container text-center text-sm text-text-muted">
          <p>Bharat Guardian AI — Know. Report. Navigate. Rescue.</p>
          <p className="mt-1">Made for India · Progressive Web App</p>
        </div>
      </footer>
    </div>
  )
}

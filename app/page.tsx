'use client'

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPinned,
  Navigation,
  RadioTower,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import LandingHeader from '@/components/landing/LandingHeader'

const features = [
  {
    icon: MapPinned,
    title: 'Road intelligence',
    desc: 'Clear, local updates about flooding, road damage, traffic, and other disruptions.',
  },
  {
    icon: ShieldCheck,
    title: 'Useful reports',
    desc: 'Share the details responders need: location, photo, context, and urgency.',
  },
  {
    icon: Navigation,
    title: 'Safe navigation',
    desc: 'Choose routes with current hazards and safety information in view.',
  },
  {
    icon: AlertTriangle,
    title: 'Disaster response',
    desc: 'Reach emergency support, nearby resources, and rescue coordination quickly.',
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-text-primary">
      <LandingHeader />

      <main className="flex-1">
        <section className="page-container py-12 sm:py-16 lg:py-20 xl:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.78fr)] lg:gap-14">
            <div className="max-w-2xl page-enter">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Community safety network is operational
              </div>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]">
                Know what is ahead. Get help when it matters.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
                Bharat Guardian brings road alerts, community reports, safe routes, and emergency support into one calm, practical place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/signup" className="btn-primary w-full sm:w-auto">
                  Join the network <ArrowRight size={17} />
                </Link>
                <Link href="/auth/login" className="btn-secondary w-full sm:w-auto">
                  Open responder portal
                </Link>
              </div>
              <div className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-surface-border pt-5">
                <div>
                  <p className="metric-value text-lg text-text-primary">24/7</p>
                  <p className="mt-1 text-xs text-text-muted">Incident visibility</p>
                </div>
                <div>
                  <p className="metric-value text-lg text-text-primary">1 tap</p>
                  <p className="mt-1 text-xs text-text-muted">To send an SOS</p>
                </div>
                <div>
                  <p className="metric-value text-lg text-text-primary">Live</p>
                  <p className="mt-1 text-xs text-text-muted">Route awareness</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
            <Card padding="none" className="relative overflow-hidden page-enter [animation-delay:100ms] group">
              <div className="flex items-center justify-between border-b border-surface-border px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <RadioTower size={15} className="text-accent" />
                  <span className="text-sm font-medium">Live response snapshot</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-green-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />Online
                </span>
              </div>
              <div className="relative min-h-[320px] overflow-hidden p-4 sm:p-5">
                <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(35deg,transparent_47%,rgba(148,163,184,0.09)_48%,rgba(148,163,184,0.09)_50%,transparent_51%),linear-gradient(-42deg,transparent_48%,rgba(148,163,184,0.08)_49%,rgba(148,163,184,0.08)_51%,transparent_52%)] [background-size:80px_80px]" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="rounded-lg border border-surface-border bg-surface/90 px-3 py-2.5 shadow-card">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-text-muted">Current area</p>
                    <p className="mt-1 text-sm font-medium">Central Indore</p>
                  </div>
                  <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-right">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-amber-300/80">Advisory</p>
                    <p className="mt-1 text-sm font-medium text-amber-200">Rain expected</p>
                  </div>
                </div>
                <div className="relative mt-12 space-y-3">
                  <div className="ml-[8%] flex w-[78%] items-center justify-between rounded-lg border border-red-500/25 bg-surface-raised/95 p-3 shadow-card">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/15"><AlertTriangle size={16} className="text-red-300" /></span>
                      <div className="min-w-0"><p className="truncate text-sm font-medium">Waterlogging reported</p><p className="mt-0.5 text-xs text-text-muted">Rajwada - 6 min ago</p></div>
                    </div>
                    <span className="hidden rounded-md bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-300 sm:block">High</span>
                  </div>
                  <div className="flex w-[68%] items-center justify-between rounded-lg border border-surface-border bg-surface-raised/90 p-3 shadow-card">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10"><Navigation size={16} className="text-blue-300" /></span>
                      <div className="min-w-0"><p className="truncate text-sm font-medium">Safer route available</p><p className="mt-0.5 text-xs text-text-muted">Adds 4 minutes</p></div>
                    </div>
                    <CheckCircle2 size={17} className="shrink-0 text-green-400" />
                  </div>
                </div>
                <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-lg border border-surface-border bg-surface/95 px-3 py-2 text-xs text-text-secondary shadow-card">
                  <Clock3 size={14} className="text-text-muted" />Updated just now
                </div>
              </div>
            </Card>
            </motion.div>
          </div>
        </section>

        <motion.section
          id="capabilities"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className="border-y border-surface-border bg-surface-raised/50 py-14 sm:py-16"
        >
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45 }}
              className="mb-8 max-w-xl sm:mb-10"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Built for the moment</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Information that is useful before, during, and after an incident.</h2>
            </motion.div>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-surface-border bg-surface-border sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="bg-surface-raised p-5 transition-colors duration-200 hover:bg-surface-overlay/60 hover:scale-[1.02] sm:p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle">
                    <feature.icon size={19} className="text-accent" />
                  </div>
                  <h3 className="mb-1.5 font-medium">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="response"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className="page-container py-14 sm:py-16 lg:py-20"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4 }}
            >
              <Card padding="lg" className="flex flex-col justify-between border-accent/20 bg-[linear-gradient(145deg,rgba(201,69,82,0.12),transparent_58%)] sm:min-h-64">
                <div>
                  <UsersRound size={21} className="mb-5 text-accent" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">For citizens</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">Make your neighbourhood easier to navigate.</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">Report what you see, understand nearby disruptions, and have a direct line to emergency support when you need it.</p>
                </div>
                <Link href="/auth/signup" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-text-primary transition-colors hover:text-accent">Create a citizen account <ArrowRight size={15} /></Link>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card padding="lg" className="flex flex-col justify-between sm:min-h-64">
                <div>
                  <Activity size={21} className="mb-5 text-blue-300" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">For response teams</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">Turn scattered reports into a clear response picture.</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">Review incoming reports, monitor resources, and coordinate field teams from one focused workspace.</p>
                </div>
                <Link href="/auth/login" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-text-primary transition-colors hover:text-blue-300">Access the responder portal <ArrowRight size={15} /></Link>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-surface-border bg-surface-raised py-7">
        <div className="page-container flex flex-col gap-1 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Bharat Guardian AI - Know. Report. Navigate. Rescue.</p>
          <p>Made for India - Progressive Web App</p>
        </div>
      </footer>
    </div>
  )
}

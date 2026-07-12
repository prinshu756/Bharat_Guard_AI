import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn('skeleton', className)} {...props} />
}

export function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('relative min-h-[300px] overflow-hidden rounded-xl border border-surface-border bg-surface-raised', className)}
      aria-busy="true"
      aria-label="Loading map"
    >
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(30deg,transparent_48%,rgba(100,116,139,0.13)_49%,rgba(100,116,139,0.13)_51%,transparent_52%),linear-gradient(-45deg,transparent_48%,rgba(100,116,139,0.1)_49%,rgba(100,116,139,0.1)_51%,transparent_52%)] [background-size:88px_88px]" />
      <Skeleton className="absolute left-[16%] top-[22%] h-2 w-[68%] -rotate-6 bg-slate-700/50" />
      <Skeleton className="absolute left-[30%] top-[54%] h-2 w-[58%] rotate-12 bg-slate-700/50" />
      <span className="absolute left-[25%] top-[30%] h-3 w-3 rounded-full bg-red-400/80 shadow-[0_0_0_5px_rgba(248,113,113,0.14)]" />
      <span className="absolute left-[60%] top-[42%] h-3 w-3 rounded-full bg-amber-400/80 shadow-[0_0_0_5px_rgba(251,191,36,0.12)]" />
      <span className="absolute left-[48%] top-[66%] h-3 w-3 rounded-full bg-blue-400/80 shadow-[0_0_0_5px_rgba(96,165,250,0.12)]" />
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-surface-border/80 bg-surface-raised/90 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        <Skeleton className="h-2.5 w-24" />
      </div>
      <div className="absolute bottom-4 right-4 space-y-2 rounded-lg border border-surface-border/80 bg-surface-raised/90 p-3">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-2.5 w-14" />
      </div>
    </div>
  )
}

export function DashboardMapSkeleton() {
  return (
    <div className="page-enter flex h-[calc(100dvh-5.5rem)] min-h-[420px] flex-col gap-4 lg:flex-row" aria-busy="true">
      <aside className="hidden w-80 shrink-0 overflow-hidden rounded-xl border border-surface-border bg-surface-raised lg:flex lg:flex-col xl:w-96">
        <div className="border-b border-surface-border p-4"><Skeleton className="h-4 w-28" /></div>
        <div className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-surface-border/80 p-3">
              <Skeleton className="mb-2 h-3 w-3/4" />
              <Skeleton className="mb-3 h-2.5 w-1/2" />
              <div className="flex gap-2"><Skeleton className="h-2.5 w-16" /><Skeleton className="h-2.5 w-10" /></div>
            </div>
          ))}
        </div>
      </aside>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-3 w-32" /></div>
          <Skeleton className="h-9 w-24" />
        </div>
        <MapSkeleton className="min-h-0 flex-1" />
      </div>
    </div>
  )
}

export function ContentPageSkeleton() {
  return (
    <div className="page-enter mx-auto max-w-3xl space-y-5" aria-busy="true">
      <div className="space-y-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-72 max-w-full" /></div>
      <div className="rounded-xl border border-surface-border bg-surface-raised p-5 sm:p-6">
        <div className="mb-6 flex gap-2"><Skeleton className="h-7 w-7 rounded-full" /><Skeleton className="h-7 flex-1" /><Skeleton className="h-7 w-7 rounded-full" /></div>
        <div className="space-y-5">
          <Skeleton className="h-4 w-1/3" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-24" />)}
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="ml-auto h-10 w-32" />
        </div>
      </div>
    </div>
  )
}

export function AdminPageSkeleton() {
  return (
    <div className="page-enter mx-auto max-w-[1280px] space-y-5" aria-busy="true">
      <div className="flex items-end justify-between gap-3"><div className="space-y-2"><Skeleton className="h-7 w-44" /><Skeleton className="h-4 w-64 max-w-full" /></div><Skeleton className="h-10 w-32" /></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-20" />)}
      </div>
      <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-raised">
        <div className="border-b border-surface-border p-4"><Skeleton className="h-4 w-28" /></div>
        <div className="space-y-0 divide-y divide-surface-border">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-1/3" /><Skeleton className="h-2.5 w-1/2" /></div>
              <Skeleton className="h-7 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AuthFormSkeleton() {
  return (
    <div className="w-full max-w-md rounded-xl border border-surface-border bg-surface-raised p-6 page-enter" aria-busy="true">
      <Skeleton className="mb-2 h-6 w-36" />
      <Skeleton className="mb-7 h-4 w-52" />
      <div className="space-y-5">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  )
}

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 page-enter" style={{ animationDelay: `${i * 60}ms` }}>
          <Skeleton className="mb-2 h-3 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-0" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 page-enter" style={{ animationDelay: `${i * 40}ms` }}>
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  )
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 page-enter" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>
          </div>
          <Skeleton className="mb-4 h-2.5 w-full" />
          <Skeleton className="mb-3 h-2.5 w-2/3" />
          <div className="flex gap-2 pt-3 border-t border-surface-border">
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

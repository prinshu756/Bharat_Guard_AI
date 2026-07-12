'use client'

import { Shield, Clock, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAppStore } from '@/lib/store'
import { getSafetyScoreColor, getSafetyScoreBg, getSafetyScoreLabel, cn } from '@/lib/utils'

const safetyTips = [
  'Avoid flooded roads — water depth is often unknown',
  'Check weather before starting your journey',
  'Keep emergency contacts readily accessible',
  'Share your route and ETA with family',
]

export default function NavigatePage() {
  const routes = useAppStore((s) => s.routes)

  return (
    <DashboardLayout userRole="user">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">Smart navigation</h1>
          <p className="text-sm text-text-secondary mt-1">Find the safest route, not just the fastest</p>
        </div>

        <Card className="mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface-overlay rounded-lg p-3">
              <p className="text-xs text-text-muted mb-1">From</p>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-text-muted" />
                Rajwada, Indore
              </div>
            </div>
            <div className="bg-surface-overlay rounded-lg p-3">
              <p className="text-xs text-text-muted mb-1">To</p>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-text-muted" />
                Vijay Nagar, Indore
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <h2 className="text-sm font-medium flex items-center gap-2 text-text-secondary">
            <Shield size={16} />
            Available routes
          </h2>

          {routes.map((route) => (
            <Card
              key={route.id}
              className={cn(
                'cursor-pointer transition-colors hover:border-slate-600',
                route.isRecommended && 'ring-1 ring-green-500/30',
                getSafetyScoreBg(route.safetyScore)
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold">{route.name}</h3>
                    {route.isRecommended && (
                      <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded border border-green-500/25 inline-flex items-center gap-1">
                        <CheckCircle2 size={10} /> Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {route.distance}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {route.estimatedTime}</span>
                  </div>
                </div>
                <div className="text-left sm:text-center">
                  <div className={cn('text-2xl font-bold', getSafetyScoreColor(route.safetyScore))}>
                    {route.safetyScore}
                  </div>
                  <div className="text-[10px] text-text-muted">Safety score</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-surface-overlay h-1.5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      route.safetyScore >= 80 ? 'bg-green-500' : route.safetyScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                    style={{ width: `${route.safetyScore}%` }}
                  />
                </div>
                <span className={cn('text-xs font-medium', getSafetyScoreColor(route.safetyScore))}>
                  {getSafetyScoreLabel(route.safetyScore)}
                </span>
              </div>

              {route.hazards.length > 0 && (
                <div className="mb-3 space-y-1">
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <AlertTriangle size={11} /> Hazards on route
                  </p>
                  {route.hazards.map((hazard, idx) => (
                    <p key={idx} className="text-xs text-red-300/90 pl-4">{hazard}</p>
                  ))}
                </div>
              )}

              <Button
                variant={route.isRecommended ? 'primary' : 'secondary'}
                className={cn('w-full', route.isRecommended && 'bg-green-700 hover:bg-green-600')}
              >
                {route.isRecommended ? 'Take this route' : 'Select route'}
              </Button>
            </Card>
          ))}

          <Card>
            <h3 className="text-sm font-medium mb-3">Safety tips</h3>
            <ul className="space-y-2">
              {safetyTips.map((tip) => (
                <li key={tip} className="text-sm text-text-secondary flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-text-muted mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

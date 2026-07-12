'use client'

import dynamic from 'next/dynamic'
import { MapPin, Navigation, Shield, RefreshCw, Filter, RadioTower, List, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import {
  getIncidentLabel,
  getIncidentIcon,
  getSeverityBadge,
  getStatusColor,
  formatTimestamp,
} from '@/lib/utils'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Sheet from '@/components/ui/Sheet'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-surface-raised">
      <div className="text-text-secondary text-sm">Loading map…</div>
    </div>
  ),
})

type SeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low'

function IncidentList({
  incidents,
  filterSeverity,
  setFilterSeverity,
  selectedIncident,
  setSelectedIncident,
  severityCounts,
}: {
  incidents: ReturnType<typeof useAppStore.getState>['incidents']
  filterSeverity: SeverityFilter
  setFilterSeverity: (f: SeverityFilter) => void
  selectedIncident: ReturnType<typeof useAppStore.getState>['selectedIncident']
  setSelectedIncident: ReturnType<typeof useAppStore.getState>['setSelectedIncident']
  severityCounts: Record<string, number>
}) {
  const filteredIncidents =
    filterSeverity === 'all' ? incidents : incidents.filter((i) => i.severity === filterSeverity)

  return (
    <>
      <div className="p-3 border-b border-surface-border space-y-1">
        {([
          { key: 'all' as const, label: 'All', count: incidents.length },
          { key: 'critical' as const, label: 'Critical', count: severityCounts.critical },
          { key: 'high' as const, label: 'High', count: severityCounts.high },
          { key: 'medium' as const, label: 'Medium', count: severityCounts.medium },
          { key: 'low' as const, label: 'Low', count: severityCounts.low },
        ]).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilterSeverity(item.key)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              filterSeverity === item.key
                ? 'bg-accent-subtle text-red-200'
                : 'text-text-secondary hover:bg-surface-overlay'
            )}
          >
            <span className="flex-1 text-left capitalize">{item.label}</span>
            <span className="text-xs text-text-muted">{item.count}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredIncidents.map((incident, idx) => (
          <button
            key={incident.id}
            type="button"
            onClick={() => setSelectedIncident(incident)}
            className={cn(
              'w-full text-left p-3 rounded-lg border transition-colors',
              selectedIncident?.id === incident.id
                ? 'bg-accent-subtle border-red-500/30'
                : 'bg-surface-overlay border-surface-border hover:border-slate-600'
            )}
          >
            <div className="flex items-start gap-2">
              <span className="text-xs font-mono text-text-muted w-5">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span>{getIncidentIcon(incident.type)}</span>
                  <span className="text-sm font-medium truncate">{incident.title}</span>
                </div>
                <p className="text-xs text-text-muted truncate">{incident.location.address}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                  <span>{formatTimestamp(incident.reportedAt)}</span>
                  <span className={cn('px-1.5 py-0.5 rounded border text-[10px]', getSeverityBadge(incident.severity))}>
                    {incident.severity}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
        {filteredIncidents.length === 0 && (
          <div className="text-center py-10 text-text-muted text-sm">
            <Filter size={24} className="mx-auto mb-2 opacity-50" />
            No incidents match this filter
          </div>
        )}
      </div>
    </>
  )
}

export default function UserMapPage() {
  const incidents = useAppStore((s) => s.incidents)
  const selectedIncident = useAppStore((s) => s.selectedIncident)
  const setSelectedIncident = useAppStore((s) => s.setSelectedIncident)
  const confirmIncident = useAppStore((s) => s.confirmIncident)
  const mode = useAppStore((s) => s.mode)
  const setMode = useAppStore((s) => s.setMode)
  const loadMockData = useAppStore((s) => s.loadMockData)
  const [listOpen, setListOpen] = useState(false)
  const [filterSeverity, setFilterSeverity] = useState<SeverityFilter>('all')

  useEffect(() => {
    loadMockData()
  }, [loadMockData])

  const severityCounts = {
    critical: incidents.filter((i) => i.severity === 'critical').length,
    high: incidents.filter((i) => i.severity === 'high').length,
    medium: incidents.filter((i) => i.severity === 'medium').length,
    low: incidents.filter((i) => i.severity === 'low').length,
  }

  const listProps = {
    incidents,
    filterSeverity,
    setFilterSeverity,
    selectedIncident,
    setSelectedIncident,
    severityCounts,
  }

  return (
    <DashboardLayout userRole="user">
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100dvh-5.5rem)] min-h-[480px]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-80 xl:w-96 flex-shrink-0 flex-col card overflow-hidden">
          <div className="p-3 border-b border-surface-border">
            <h2 className="font-semibold text-sm">Road intelligence</h2>
          </div>
          <IncidentList {...listProps} />
        </aside>

        {/* Map */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex items-center justify-between gap-3 mb-3 flex-shrink-0">
            <div>
              <h2 className="text-base font-semibold">Live map</h2>
              <p className="text-xs text-text-muted">{incidents.length} active incidents</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadMockData()}
                className="btn-ghost p-2"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setMode(mode === 'normal' ? 'disaster' : 'normal')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  mode === 'disaster'
                    ? 'bg-accent text-white'
                    : 'bg-surface-overlay border border-surface-border text-text-secondary'
                )}
              >
                <RadioTower size={12} />
                <span className="hidden sm:inline">{mode === 'disaster' ? 'Disaster' : 'Normal'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 card overflow-hidden min-h-0">
            <MapView />
          </div>
        </div>
      </div>

      {/* Mobile: bottom sheet for incident list */}
      <Sheet open={listOpen} onClose={() => setListOpen(false)} title="Incidents" side="bottom">
        <div className="flex flex-col max-h-[70vh]">
          <IncidentList {...listProps} />
        </div>
      </Sheet>

      {/* Mobile: toggle list FAB */}
      <button
        type="button"
        onClick={() => setListOpen(true)}
        className="lg:hidden fixed bottom-6 left-4 z-30 btn-primary p-3 rounded-full shadow-elevated safe-bottom"
        aria-label="Show incident list"
      >
        <List size={20} />
      </button>

      {/* Incident detail modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedIncident(null)} aria-hidden />
          <div className="relative w-full max-w-lg card shadow-elevated animate-fade-in max-h-[85vh] overflow-y-auto">
            <div className="p-4 border-b border-surface-border flex items-center justify-between sticky top-0 bg-surface-raised">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl">{getIncidentIcon(selectedIncident.type)}</span>
                <h3 className="font-semibold truncate">{selectedIncident.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedIncident(null)} className="btn-ghost p-1.5">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={cn('text-xs px-2 py-0.5 rounded border', getSeverityBadge(selectedIncident.severity))}>
                  {selectedIncident.severity.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-surface-overlay text-text-secondary">
                  {getIncidentLabel(selectedIncident.type)}
                </span>
                <span className={cn('text-xs px-2 py-0.5 rounded', getStatusColor(selectedIncident.status))}>
                  {selectedIncident.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-sm text-text-secondary">{selectedIncident.description}</p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-surface-overlay rounded-lg p-3">
                  <p className="text-xs text-text-muted mb-1">Location</p>
                  <p>{selectedIncident.location.address}</p>
                </div>
                <div className="bg-surface-overlay rounded-lg p-3">
                  <p className="text-xs text-text-muted mb-1">Reported</p>
                  <p>{formatTimestamp(selectedIncident.reportedAt)}</p>
                </div>
                <div className="bg-surface-overlay rounded-lg p-3">
                  <p className="text-xs text-text-muted mb-1">AI verification</p>
                  <p className="font-mono text-green-400">{selectedIncident.aiVerificationScore}%</p>
                </div>
                <div className="bg-surface-overlay rounded-lg p-3">
                  <p className="text-xs text-text-muted mb-1">Confirmations</p>
                  <p>{selectedIncident.citizenConfirmations} citizens</p>
                </div>
              </div>

              {selectedIncident.suggestedAlternateRoute && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm">
                  <p className="text-blue-300 font-medium text-xs mb-1">Suggested alternate route</p>
                  <p className="text-blue-200">{selectedIncident.suggestedAlternateRoute}</p>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => confirmIncident(selectedIncident.id)}
                >
                  Confirm ({selectedIncident.citizenConfirmations})
                </Button>
                <Button className="flex-1">
                  <Navigation size={14} />
                  Navigate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

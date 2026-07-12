'use client'

import { useState } from 'react'
import { AlertTriangle, RadioTower, MapPin, Users, Shield, Clock, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAppStore } from '@/lib/store'
import { formatTimestamp, cn } from '@/lib/utils'

export default function AdminDisastersPage() {
  const disasterAlerts = useAppStore((s) => s.disasterAlerts)
  const citizenReports = useAppStore((s) => s.citizenReports)
  const [activeTab, setActiveTab] = useState<'alerts' | 'reports'>('alerts')

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-5 animate-fade-in">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Disaster management</h1>
          <p className="text-sm text-text-secondary">Active disasters and citizen emergency reports</p>
        </div>

        <div className="flex gap-1 p-1 card">
          {(['alerts', 'reports'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab ? 'bg-accent-subtle text-red-200' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {tab === 'alerts' ? 'Active disasters' : 'Citizen reports'}
            </button>
          ))}
        </div>

        {activeTab === 'alerts' && (
          <div className="space-y-3">
            {disasterAlerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
              >
              <Card
                className={cn(
                  alert.severity === 'critical' && 'border-red-500/30',
                  alert.severity === 'high' && 'border-orange-500/25'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-accent-subtle rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={18} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">{alert.title}</h3>
                      <p className="text-sm text-text-secondary mt-0.5">{alert.description}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded border border-red-500/30 text-red-300 uppercase">{alert.severity}</span>
                    <p className="text-xs text-text-muted mt-1">{alert.confidence}% confidence</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 text-sm">
                  <div className="bg-surface-overlay rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-0.5">Location</p>
                    <p className="truncate">{alert.location.address}</p>
                  </div>
                  <div className="bg-surface-overlay rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-0.5">Affected</p>
                    <p>{alert.affectedPopulation.toLocaleString()}</p>
                  </div>
                  <div className="bg-surface-overlay rounded-lg p-3">
                    <p className="text-xs text-text-muted mb-0.5">Reported</p>
                    <p>{formatTimestamp(alert.timestamp)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-surface-border">
                  <Button size="sm"><RadioTower size={14} /> Dispatch teams</Button>
                  <Button variant="secondary" size="sm">View details</Button>
                </div>
              </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-3">
            {citizenReports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-medium capitalize text-sm">{report.type.replace('_', ' ')}</h3>
                    <p className="text-sm text-text-secondary">{report.description}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded border border-surface-border capitalize flex-shrink-0">{report.status}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-3">
                  <div className="bg-surface-overlay rounded-lg p-3">
                    <p className="text-xs text-text-muted">Location</p>
                    <p className="truncate">{report.location.address}</p>
                  </div>
                  <div className="bg-surface-overlay rounded-lg p-3">
                    <p className="text-xs text-text-muted">Reporter</p>
                    <p>{report.reporterName}</p>
                  </div>
                  <div className="bg-surface-overlay rounded-lg p-3">
                    <p className="text-xs text-text-muted">Phone</p>
                    <p>{report.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-surface-border">
                  <span className="text-xs text-text-muted">{formatTimestamp(report.timestamp)}</span>
                  <div className="flex gap-2">
                    {report.status === 'received' && <Button size="sm">Dispatch</Button>}
                    {report.status === 'dispatched' && (
                      <Button size="sm" className="bg-green-700 hover:bg-green-600">
                        <CheckCircle2 size={14} /> Resolved
                      </Button>
                    )}
                    <Button variant="secondary" size="sm">Details</Button>
                  </div>
                </div>
              </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

'use client'

import { Users, Shield, AlertTriangle, Truck, Clock, CheckCircle2, Building2, MapPin, Phone, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function AdminTeamsPage() {
  const rescueTeams = useAppStore((s) => s.rescueTeams)
  const citizenReports = useAppStore((s) => s.citizenReports)

  const stats = [
    { label: 'Total teams', value: rescueTeams.length },
    { label: 'Deployed', value: rescueTeams.filter((t) => t.status === 'deployed').length, highlight: 'text-amber-400' },
    { label: 'Available', value: rescueTeams.filter((t) => t.status === 'available').length, highlight: 'text-green-400' },
    { label: 'Members', value: rescueTeams.reduce((sum, t) => sum + t.members, 0) },
    { label: 'Active SOS', value: citizenReports.filter((r) => r.status === 'received' || r.status === 'dispatched').length, highlight: 'text-red-300' },
  ]

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Rescue teams</h1>
            <p className="text-sm text-text-secondary">Manage teams and emergency requests</p>
          </div>
          <Button variant="secondary" size="sm">Add team</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {stats.map(({ label, value, highlight }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <Card>
                <p className="text-xs text-text-muted mb-0.5">{label}</p>
                <p className={cn('text-xl font-semibold', highlight)}>{value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card padding="none">
          <div className="p-4 border-b border-surface-border flex items-center justify-between">
            <h2 className="font-medium text-sm flex items-center gap-2"><Shield size={16} /> Teams</h2>
            <span className="text-xs text-text-muted">{rescueTeams.length}</span>
          </div>
          <div className="divide-y divide-surface-border">
            {rescueTeams.map((team, idx) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className="p-4 hover:bg-surface-overlay/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-surface-overlay rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield size={18} className="text-text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{team.name}</p>
                      <p className="text-xs text-text-muted capitalize">{team.type} · {team.members} members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded border border-surface-border capitalize">{team.status}</span>
                    {team.eta && <span className="text-xs text-text-muted">{team.eta}</span>}
                    <button type="button" className="btn-ghost p-1.5"><MoreVertical size={14} /></button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-text-muted flex items-center gap-1"><MapPin size={11} /> {team.location.address}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card padding="none">
          <div className="p-4 border-b border-surface-border flex items-center justify-between">
            <h2 className="font-medium text-sm flex items-center gap-2"><AlertTriangle size={16} className="text-accent" /> Citizen SOS</h2>
            <span className="text-xs text-text-muted">{citizenReports.length}</span>
          </div>
          <div className="divide-y divide-surface-border">
            {citizenReports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="p-4 hover:bg-surface-overlay/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium capitalize text-sm">{report.type.replace('_', ' ')}</p>
                    <p className="text-sm text-text-secondary truncate">{report.description}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><Phone size={10} /> {report.reporterName}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {report.location.address}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded border border-surface-border capitalize flex-shrink-0">{report.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

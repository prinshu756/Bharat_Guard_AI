'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, Clock, MapPin, CheckCircle2, Filter, MoreVertical, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import { useAppStore } from '@/lib/store'
import { getIncidentIcon, getIncidentLabel, getSeverityBadge, getStatusColor, cn } from '@/lib/utils'
import { type ReportStatus } from '@/lib/types'

const statusFlow: { status: ReportStatus; label: string; icon: typeof Clock }[] = [
  { status: 'submitted', label: 'Submitted', icon: Clock },
  { status: 'under_verification', label: 'Verifying', icon: AlertTriangle },
  { status: 'assigned', label: 'Assigned', icon: Truck },
  { status: 'work_in_progress', label: 'In Progress', icon: AlertTriangle },
  { status: 'resolved', label: 'Resolved', icon: CheckCircle2 },
]

const statusIndex: Record<ReportStatus, number> = {
  submitted: 0,
  under_verification: 1,
  verified: 1,
  assigned: 2,
  work_in_progress: 3,
  resolved: 4,
}

export default function AdminDashboardPage() {
  const complaints = useAppStore((s) => s.complaints)
  const updateComplaintStatus = useAppStore((s) => s.updateComplaintStatus)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')
  const [search, setSearch] = useState('')

  const filteredComplaints = complaints.filter((c) => {
    if (filter === 'active' && c.status === 'resolved') return false
    if (filter === 'resolved' && c.status !== 'resolved') return false
    if (search && !getIncidentLabel(c.type).toLowerCase().includes(search.toLowerCase()) && !c.description.toLowerCase().includes(search.toLowerCase()) && !c.location.address?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const stats = {
    total: complaints.length,
    active: complaints.filter((c) => c.status !== 'resolved').length,
    inProgress: complaints.filter((c) => ['under_verification', 'assigned', 'work_in_progress'].includes(c.status)).length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
  }

  const statCards = [
    { label: 'Total', value: stats.total, icon: Shield },
    { label: 'Active', value: stats.active, icon: AlertTriangle, highlight: 'text-amber-400' },
    { label: 'In progress', value: stats.inProgress, icon: Truck, highlight: 'text-blue-400' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, highlight: 'text-green-400' },
  ]

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Complaints</h1>
            <p className="text-sm text-text-secondary">Manage and track citizen reports</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="input-field sm:w-auto"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="input-field sm:w-56"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map(({ label, value, icon: Icon, highlight }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.06 }}
            >
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-overlay rounded-lg flex items-center justify-center">
                    <Icon size={18} className="text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">{label}</p>
                    <p className={cn('text-xl font-semibold', highlight)}>{value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-surface-border bg-surface-overlay/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">Incident</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted hidden md:table-cell">Reporter</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted hidden lg:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredComplaints.map((complaint, idx) => {
                  const currentIdx = statusIndex[complaint.status]
                  return (
                    <motion.tr
                      key={complaint.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className="hover:bg-surface-overlay/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{getIncidentIcon(complaint.type)}</span>
                          <div>
                            <p className="font-medium text-sm">{getIncidentLabel(complaint.type)}</p>
                            <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', getSeverityBadge(complaint.aiSeverity))}>
                              {complaint.aiSeverity}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-text-secondary max-w-[180px]">
                          <MapPin size={12} className="flex-shrink-0" />
                          <span className="truncate">{complaint.location.address}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm">{complaint.reportedBy}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-0.5">
                          {statusFlow.map((step, idx) => {
                            const Icon = step.icon
                            const isActive = idx <= currentIdx
                            return (
                              <div key={step.status} title={step.label} className={cn(
                                'w-5 h-5 rounded-full flex items-center justify-center',
                                isActive ? 'bg-accent/80 text-white' : 'bg-surface-overlay text-text-muted'
                              )}>
                                <Icon size={9} />
                              </div>
                            )
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <select
                            value={complaint.status}
                            onChange={(e) => updateComplaintStatus(complaint.id, e.target.value as ReportStatus)}
                            className="input-field py-1.5 text-xs w-auto"
                          >
                            {statusFlow.map((s) => (
                              <option key={s.status} value={s.status}>{s.label}</option>
                            ))}
                          </select>
                          <button type="button" className="btn-ghost p-1.5 hidden sm:flex">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filteredComplaints.length === 0 && (
            <div className="p-10 text-center text-text-muted text-sm">
              <Filter size={24} className="mx-auto mb-2 opacity-50" />
              No complaints found
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}

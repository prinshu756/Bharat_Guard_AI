'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, AlertCircle, Users, ArrowLeft } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { getIncidentIcon, getIncidentLabel, getSeverityBadge, formatTimestamp } from '@/lib/utils'
import { type ReportStatus } from '@/lib/types'

const statusFlow: { status: ReportStatus; label: string; icon: typeof Clock }[] = [
  { status: 'submitted', label: 'Submitted', icon: Clock },
  { status: 'under_verification', label: 'Under Verification', icon: AlertCircle },
  { status: 'assigned', label: 'Assigned', icon: Users },
  { status: 'work_in_progress', label: 'Work In Progress', icon: AlertCircle },
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

export default function ComplaintDashboard() {
  const complaints = useAppStore((s) => s.complaints)
  const sidebarView = useAppStore((s) => s.sidebarView)
  const setSidebarView = useAppStore((s) => s.setSidebarView)

  const activeComplaints = complaints.filter((c) => c.status !== 'resolved')
  const resolvedComplaints = complaints.filter((c) => c.status === 'resolved')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {sidebarView === 'complaints' && (
            <button onClick={() => setSidebarView('list')} className="p-1 hover:bg-slate-700 rounded transition-colors">
              <ArrowLeft size={18} />
            </button>
          )}
          <h2 className="text-lg font-semibold">Complaint Dashboard</h2>
        </div>
        <span className="text-xs text-gray-500">{complaints.length} total</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{activeComplaints.length}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{complaints.filter(c => c.status === 'under_verification' || c.status === 'assigned').length}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{resolvedComplaints.length}</p>
          <p className="text-xs text-gray-500">Resolved</p>
        </div>
      </div>

      <div className="space-y-2">
        {complaints.map((complaint) => {
          const currentIdx = statusIndex[complaint.status]
          return (
            <div key={complaint.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-lg">{getIncidentIcon(complaint.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium truncate">{getIncidentLabel(complaint.type)}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getSeverityBadge(complaint.aiSeverity)}`}>
                      {complaint.aiSeverity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{complaint.description}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{complaint.location.address || `${complaint.location.lat.toFixed(4)}, ${complaint.location.lng.toFixed(4)}`}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {statusFlow.map((step, idx) => {
                  const Icon = step.icon
                  const isActive = idx <= currentIdx
                  const isCurrent = idx === currentIdx
                  return (
                    <div key={step.status} className="flex-1 flex flex-col items-center relative">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-500'
                        } ${isCurrent ? 'ring-2 ring-blue-400/50' : ''}`}
                      >
                        <Icon size={12} />
                      </div>
                      <span className={`text-[10px] mt-1 text-center leading-tight ${isActive ? 'text-blue-400' : 'text-gray-600'}`}>
                        {step.label}
                      </span>
                      {idx < statusFlow.length - 1 && (
                        <div className={`h-px w-full absolute top-3 left-1/2 ${isActive ? 'bg-blue-600/50' : 'bg-slate-700'}`} />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50">
                <span className="text-[10px] text-gray-600">{formatTimestamp(complaint.reportedAt)}</span>
                {complaint.status !== 'resolved' && (
                  <span className="text-[10px] text-gray-600">By: {complaint.reportedBy}</span>
                )}
                {complaint.resolvedAt && (
                  <span className="text-[10px] text-green-600">Resolved {formatTimestamp(complaint.resolvedAt)}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

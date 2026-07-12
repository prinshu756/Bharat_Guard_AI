'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, Shield, Users, Route, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import {
  getIncidentLabel,
  getIncidentIcon,
  getSeverityBadge,
  getStatusColor,
  formatTimestamp,
} from '@/lib/utils'

export default function IncidentPanel() {
  const selectedIncident = useAppStore((s) => s.selectedIncident)
  const setSelectedIncident = useAppStore((s) => s.setSelectedIncident)
  const confirmIncident = useAppStore((s) => s.confirmIncident)
  const incidents = useAppStore((s) => s.incidents)
  const sidebarView = useAppStore((s) => s.sidebarView)
  const setSidebarView = useAppStore((s) => s.setSidebarView)

  return (
    <AnimatePresence mode="wait">
      {sidebarView === 'details' && selectedIncident ? (
        <motion.div
          key="details"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getIncidentIcon(selectedIncident.type)}</span>
              <h3 className="font-semibold text-lg">{selectedIncident.title}</h3>
            </div>
            <button
              onClick={() => { setSelectedIncident(null); setSidebarView('list') }}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityBadge(selectedIncident.severity)}`}>
              {selectedIncident.severity.toUpperCase()}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-gray-300">
              {getIncidentLabel(selectedIncident.type)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedIncident.status)}`}>
              {selectedIncident.status.replace('_', ' ')}
            </span>
          </div>

          <p className="text-sm text-gray-400">{selectedIncident.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <MapPin size={12} /> Location
              </div>
              <p className="text-sm">{selectedIncident.location.address}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Clock size={12} /> Reported
              </div>
              <p className="text-sm">{formatTimestamp(selectedIncident.reportedAt)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Shield size={12} /> AI Verification
              </div>
              <p className="text-sm font-mono text-green-400">{selectedIncident.aiVerificationScore}%</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Users size={12} /> Confirmations
              </div>
              <p className="text-sm">{selectedIncident.citizenConfirmations} citizens</p>
            </div>
          </div>

          {selectedIncident.imageUrl && (
            <div className="bg-slate-800/50 rounded-lg overflow-hidden">
              <div className="bg-slate-700 h-32 flex items-center justify-center text-gray-500 text-sm">
                📸 Image Evidence
              </div>
            </div>
          )}

          {selectedIncident.suggestedAlternateRoute && (
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Route size={16} className="text-blue-400 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-300 font-medium mb-1">Suggested Alternate Route</p>
                  <p className="text-sm text-blue-200">{selectedIncident.suggestedAlternateRoute}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => confirmIncident(selectedIncident.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              ✓ Confirm ({selectedIncident.citizenConfirmations})
            </button>
            <button
              onClick={() => setSidebarView('navigation')}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              🧭 Navigate Safely
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Road Intelligence</h2>
            <span className="text-xs text-gray-500">{incidents.length} reports</span>
          </div>
          {incidents.map((incident, idx) => (
            <div
              key={incident.id}
              onClick={() => { setSelectedIncident(incident); setSidebarView('details') }}
              className="bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 rounded-lg p-3 cursor-pointer transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: incident.severity === 'critical' ? '#ef444420' : incident.severity === 'high' ? '#f9731620' : '#eab30820', color: incident.severity === 'critical' ? '#ef4444' : incident.severity === 'high' ? '#f97316' : '#eab308' }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span>{getIncidentIcon(incident.type)}</span>
                    <span className="text-sm font-medium truncate">{incident.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{incident.location.address}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span>{formatTimestamp(incident.reportedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Shield size={10} /> {incident.aiVerificationScore}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={10} /> {incident.citizenConfirmations}
                    </span>
                  </div>
                </div>
                {incident.severity === 'critical' && (
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

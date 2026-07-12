'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Radio, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function DisasterHeader() {
  const mode = useAppStore((s) => s.mode)
  const setMode = useAppStore((s) => s.setMode)
  const disasterAlerts = useAppStore((s) => s.disasterAlerts)

  if (mode === 'normal') return null

  const criticalAlerts = disasterAlerts.filter((a) => a.severity === 'critical')

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="bg-gradient-to-r from-red-900/80 to-orange-900/80 border-b border-red-700/50 backdrop-blur"
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-red-300" />
              <span className="font-bold text-red-200 text-sm">DISASTER MODE ACTIVE</span>
              <span className="text-xs text-red-300/70">|</span>
              <span className="text-xs text-red-300/70">{disasterAlerts.length} alerts</span>
            </div>
            <p className="text-xs text-red-200/60 mt-0.5">
              {criticalAlerts.length > 0
                ? `⚠️ ${criticalAlerts.length} critical alert${criticalAlerts.length > 1 ? 's' : ''} - ${criticalAlerts[0]?.title}`
                : 'Emergency services are active. Use SOS for immediate help.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setMode('normal')}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          title="Exit Disaster Mode"
        >
          <X size={16} className="text-red-300" />
        </button>
      </div>
    </motion.div>
  )
}

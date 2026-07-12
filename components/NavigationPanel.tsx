'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Shield, AlertTriangle, Clock, MapPin } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { getSafetyScoreColor, getSafetyScoreBg, getSafetyScoreLabel } from '@/lib/utils'

export default function NavigationPanel() {
  const routes = useAppStore((s) => s.routes)
  const setSidebarView = useAppStore((s) => s.setSidebarView)

  const safetyTips = [
    'Avoid flooded roads - water depth unknown',
    'Check weather before starting',
    'Keep emergency contacts handy',
    'Share your route with family',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <button onClick={() => setSidebarView('list')} className="p-1 hover:bg-slate-700 rounded transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-semibold">Smart Navigation</h2>
      </div>

      <div className="bg-slate-800/30 rounded-lg p-3 flex items-center gap-3">
        <MapPin size={16} className="text-gray-400" />
        <div className="flex-1">
          <p className="text-xs text-gray-500">From</p>
          <p className="text-sm">Rajwada, Indore</p>
        </div>
        <div className="text-gray-500">→</div>
        <div className="flex-1">
          <p className="text-xs text-gray-500">To</p>
          <p className="text-sm">Vijay Nagar, Indore</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-400 font-medium">Available Routes</p>
        {routes.map((route) => (
          <div
            key={route.id}
            className={`rounded-lg border p-4 cursor-pointer transition-all hover:border-opacity-100 ${
              route.isRecommended ? 'ring-2 ring-green-500/30' : ''
            } ${getSafetyScoreBg(route.safetyScore)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{route.name}</h3>
                  {route.isRecommended && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} /> {route.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {route.estimatedTime}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getSafetyScoreColor(route.safetyScore)}`}>
                  {route.safetyScore}
                </div>
                <div className="text-xs text-gray-500">/100</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Shield size={12} className="text-gray-400" />
              <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    route.safetyScore >= 80 ? 'bg-green-500' : route.safetyScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${route.safetyScore}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${getSafetyScoreColor(route.safetyScore)}`}>
                {getSafetyScoreLabel(route.safetyScore)}
              </span>
            </div>

            {route.hazards.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <AlertTriangle size={10} /> Hazards along this route:
                </p>
                {route.hazards.map((hazard, idx) => (
                  <div key={idx} className="text-xs text-red-400 flex items-center gap-1 ml-3">
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    {hazard}
                  </div>
                ))}
              </div>
            )}

            <button
              className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                route.isRecommended
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              }`}
            >
              {route.isRecommended ? 'Take This Route' : 'Select Route'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/30 rounded-lg p-3">
        <p className="text-xs text-gray-400 font-medium mb-2">Safety Tips</p>
        <ul className="space-y-1">
          {safetyTips.map((tip, idx) => (
            <li key={idx} className="text-xs text-gray-500 flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-400 rounded-full" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

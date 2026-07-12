'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Building, Hospital, UtensilsCrossed, Droplets, Battery, Stethoscope, Phone as PhoneIcon, Users } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { type EmergencyResource } from '@/lib/types'

const resourceConfig: Record<EmergencyResource['type'], { icon: typeof Building; label: string; color: string }> = {
  shelter: { icon: Building, label: 'Shelter', color: 'text-green-400' },
  hospital: { icon: Hospital, label: 'Hospital', color: 'text-red-400' },
  food_distribution: { icon: UtensilsCrossed, label: 'Food Distribution', color: 'text-yellow-400' },
  water_point: { icon: Droplets, label: 'Water Point', color: 'text-blue-400' },
  charging_station: { icon: Battery, label: 'Charging Station', color: 'text-purple-400' },
  medical_camp: { icon: Stethoscope, label: 'Medical Camp', color: 'text-orange-400' },
}

export default function ResourcesPanel() {
  const emergencyResources = useAppStore((s) => s.emergencyResources)
  const setSidebarView = useAppStore((s) => s.setSidebarView)

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
        <h2 className="text-lg font-semibold">Emergency Resources</h2>
      </div>

      <div className="space-y-2">
        {emergencyResources.map((res) => {
          const config = resourceConfig[res.type]
          const Icon = config.icon
          const occupancyPercent = Math.round((res.currentOccupancy / res.capacity) * 100)

          return (
            <div key={res.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Icon size={20} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{res.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      res.status === 'available' ? 'bg-green-500/20 text-green-400' :
                      res.status === 'limited' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{config.label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{res.location.address}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <Users size={12} className="text-gray-500" />
                    <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${occupancyPercent > 80 ? 'bg-red-500' : occupancyPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${occupancyPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{res.currentOccupancy}/{res.capacity}</span>
                  </div>

                  {res.phone && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                      <PhoneIcon size={10} /> {res.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

'use client'

import { Building2, UtensilsCrossed, Droplets, Battery, Stethoscope, Shield as ShieldIcon, MapPin, Phone, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAppStore } from '@/lib/store'
import { type EmergencyResource } from '@/lib/types'
import { cn } from '@/lib/utils'

const resourceConfig: Record<EmergencyResource['type'], { icon: typeof Building2; label: string }> = {
  shelter: { icon: Building2, label: 'Shelter' },
  hospital: { icon: Stethoscope, label: 'Hospital' },
  food_distribution: { icon: UtensilsCrossed, label: 'Food' },
  water_point: { icon: Droplets, label: 'Water' },
  charging_station: { icon: Battery, label: 'Charging' },
  medical_camp: { icon: ShieldIcon, label: 'Medical camp' },
}

export default function AdminResourcesPage() {
  const emergencyResources = useAppStore((s) => s.emergencyResources)

  const stats = {
    total: emergencyResources.length,
    available: emergencyResources.filter((r) => r.status === 'available').length,
    limited: emergencyResources.filter((r) => r.status === 'limited').length,
    full: emergencyResources.filter((r) => r.status === 'full').length,
    totalCapacity: emergencyResources.reduce((sum, r) => sum + r.capacity, 0),
    currentOccupancy: emergencyResources.reduce((sum, r) => sum + r.currentOccupancy, 0),
  }

  const statCards = [
    { label: 'Total', value: stats.total },
    { label: 'Available', value: stats.available, highlight: 'text-green-400' },
    { label: 'Limited', value: stats.limited, highlight: 'text-amber-400' },
    { label: 'Full', value: stats.full, highlight: 'text-red-300' },
    { label: 'Occupancy', value: `${Math.round((stats.currentOccupancy / stats.totalCapacity) * 100)}%` },
  ]

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-5 animate-fade-in">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Emergency resources</h1>
          <p className="text-sm text-text-secondary">Shelters, hospitals, and relief points</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {statCards.map(({ label, value, highlight }, idx) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {emergencyResources.map((res, idx) => {
            const config = resourceConfig[res.type]
            const Icon = config.icon
            const occupancyPercent = Math.round((res.currentOccupancy / res.capacity) * 100)

            return (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
              <Card className="hover:border-slate-600 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-surface-overlay rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">{res.name}</h3>
                    <span className="text-xs text-text-muted">{config.label}</span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary flex items-center gap-1 mb-3 truncate">
                  <MapPin size={12} /> {res.location.address}
                </p>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-text-muted mb-1">
                    <span>Occupancy</span>
                    <span>{res.currentOccupancy} / {res.capacity}</span>
                  </div>
                  <div className="h-1.5 bg-surface-overlay rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        occupancyPercent > 90 ? 'bg-red-500' : occupancyPercent > 70 ? 'bg-amber-500' : 'bg-green-500'
                      )}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="capitalize px-2 py-0.5 rounded border border-surface-border">{res.status}</span>
                  {res.phone && (
                    <span className="text-text-muted flex items-center gap-1"><Phone size={11} /> {res.phone}</span>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-surface-border">
                  <Button variant="secondary" size="sm" className="flex-1">Call</Button>
                  <Button variant="secondary" size="sm" className="flex-1"><Truck size={12} /> Dispatch</Button>
                </div>
              </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center">
          <Button variant="secondary">Add resource</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

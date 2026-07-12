'use client'

import { useState } from 'react'
import { Camera, Mic, MapPin, Send, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/lib/auth-store'
import { useAppStore } from '@/lib/store'
import { type IncidentType } from '@/lib/types'
import { getIncidentLabel, getIncidentIcon, cn } from '@/lib/utils'

const incidentTypes: IncidentType[] = [
  'pothole', 'flooded_road', 'waterlogging', 'mud_slippery_road',
  'fallen_tree', 'road_blockage', 'broken_bridge', 'fire',
  'accident', 'traffic_congestion', 'construction', 'landslide',
]

export default function ReportPage() {
  const { user } = useAuthStore()
  const createReport = useAppStore((s) => s.createReport)
  const userLocation = useAppStore((s) => s.userLocation)
  const [step, setStep] = useState<'type' | 'details' | 'confirm'>('type')
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null)
  const [description, setDescription] = useState('')
  const [name, setName] = useState(user?.name || '')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handlePhotoCapture = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleSubmit = () => {
    if (!selectedType || !description) return
    createReport({
      type: selectedType,
      description,
      location: userLocation || { lat: 22.7196, lng: 75.8577 },
      photoUrl: photoPreview || undefined,
      reportedBy: name || 'Anonymous',
    })
    setSubmitted(true)
    setTimeout(() => {
      setStep('type')
      setSelectedType(null)
      setDescription('')
      setPhotoPreview(null)
      setSubmitted(false)
    }, 3000)
  }

  const stepIndex = step === 'type' ? 0 : step === 'details' ? 1 : 2

  return (
    <DashboardLayout userRole="user">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">Report an issue</h1>
          <p className="text-sm text-text-secondary mt-1">Help keep your community safe</p>
        </div>

        {submitted ? (
          <Card padding="lg" className="text-center">
            <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-green-400 mb-1">Report submitted</h2>
            <p className="text-sm text-text-secondary">Sent for verification. Thank you for reporting.</p>
          </Card>
        ) : (
          <Card padding="none" className="overflow-hidden">
            <div className="px-4 sm:px-5 py-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                {['Type', 'Details', 'Confirm'].map((label, i) => (
                  <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold',
                        i <= stepIndex ? 'bg-accent text-white' : 'bg-surface-overlay text-text-muted'
                      )}
                    >
                      {i + 1}
                    </div>
                    <span className={cn('hidden sm:block text-xs', i === stepIndex ? 'text-text-primary' : 'text-text-muted')}>
                      {label}
                    </span>
                    {i < 2 && <div className={cn('flex-1 h-px', i < stepIndex ? 'bg-accent/50' : 'bg-surface-border')} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-5">
              {step === 'type' && (
                <div>
                  <p className="text-sm text-text-secondary mb-4">Select the type of issue</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {incidentTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => { setSelectedType(type); setStep('details') }}
                        className="p-3 rounded-lg border border-surface-border bg-surface-overlay hover:border-slate-600 transition-colors text-center min-h-[88px] flex flex-col items-center justify-center gap-1"
                      >
                        <span className="text-2xl">{getIncidentIcon(type)}</span>
                        <span className="text-xs text-text-secondary leading-tight">{getIncidentLabel(type)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'details' && (
                <div className="space-y-4">
                  <button type="button" onClick={() => setStep('type')} className="text-xs text-accent hover:underline">
                    ← Change type · {selectedType && getIncidentLabel(selectedType)}
                  </button>

                  <div>
                    <label className="text-sm text-text-secondary mb-2 block">Photo</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handlePhotoCapture}
                        className="w-20 h-20 rounded-lg border border-surface-border bg-surface-overlay flex flex-col items-center justify-center text-text-muted hover:border-slate-600 text-xs gap-1"
                      >
                        <Camera size={20} />
                        Camera
                      </button>
                      {photoPreview ? (
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" loading="lazy" />
                          <button type="button" onClick={() => setPhotoPreview(null)} className="absolute -top-1 -right-1 bg-accent rounded-full w-5 h-5 text-xs">×</button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg border border-surface-border bg-surface-overlay flex flex-col items-center justify-center text-text-muted text-xs gap-1">
                          <Mic size={20} />
                          Voice
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-text-secondary mb-1.5 block">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue…"
                      className="input-field resize-none h-24"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-text-secondary mb-1.5 block">Your name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anonymous"
                      className="input-field"
                    />
                  </div>

                  <div className="bg-surface-overlay rounded-lg p-3 flex items-center gap-2 text-xs text-text-secondary">
                    <MapPin size={14} className="text-accent flex-shrink-0" />
                    <span>Location attached automatically</span>
                    <span className="ml-auto font-mono text-text-muted">
                      {userLocation?.lat.toFixed(4)}, {userLocation?.lng.toFixed(4)}
                    </span>
                  </div>

                  <Button onClick={() => setStep('confirm')} disabled={!description} className="w-full">
                    Continue
                  </Button>
                </div>
              )}

              {step === 'confirm' && (
                <div className="space-y-4">
                  <div className="bg-surface-overlay rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedType && getIncidentIcon(selectedType)}</span>
                      <span className="font-medium">{selectedType && getIncidentLabel(selectedType)}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{description}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setStep('details')} className="flex-1">Edit</Button>
                    <Button onClick={handleSubmit} className="flex-1">
                      <Send size={16} /> Submit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

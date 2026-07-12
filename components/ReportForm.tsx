'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Mic, MapPin, Send } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { type IncidentType } from '@/lib/types'
import { getIncidentLabel, getIncidentIcon } from '@/lib/utils'

const incidentTypes: IncidentType[] = [
  'pothole', 'flooded_road', 'waterlogging', 'mud_slippery_road',
  'fallen_tree', 'road_blockage', 'broken_bridge', 'fire',
  'accident', 'traffic_congestion', 'construction', 'landslide',
]

export default function ReportForm() {
  const showReportForm = useAppStore((s) => s.showReportForm)
  const setShowReportForm = useAppStore((s) => s.setShowReportForm)
  const createReport = useAppStore((s) => s.createReport)
  const userLocation = useAppStore((s) => s.userLocation)

  const [step, setStep] = useState<'type' | 'details' | 'confirm'>('type')
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null)
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

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
    if (!selectedType || !description || !name) return
    createReport({
      type: selectedType,
      description,
      location: userLocation || { lat: 22.7196, lng: 75.8577 },
      photoUrl: photoPreview || undefined,
      reportedBy: name,
    })
    setShowReportForm(false)
    setStep('type')
    setSelectedType(null)
    setDescription('')
    setName('')
    setPhotoPreview(null)
  }

  const handleClose = () => {
    setShowReportForm(false)
    setStep('type')
    setSelectedType(null)
    setDescription('')
    setName('')
    setPhotoPreview(null)
  }

  return (
    <AnimatePresence>
      {showReportForm && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 rounded-t-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Report an Issue</h2>
                <button onClick={handleClose} className="p-1 hover:bg-slate-800 rounded transition-colors">
                  <X size={20} />
                </button>
              </div>

              {step === 'type' && (
                <div>
                  <p className="text-sm text-gray-400 mb-4">Select the type of issue you want to report</p>
                  <div className="grid grid-cols-3 gap-3">
                    {incidentTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => { setSelectedType(type); setStep('details') }}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          selectedType === type
                            ? 'bg-blue-600/20 border-blue-500/50'
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="text-2xl mb-1">{getIncidentIcon(type)}</div>
                        <div className="text-xs text-gray-300 leading-tight">{getIncidentLabel(type)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'details' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <button onClick={() => setStep('type')} className="text-blue-400 hover:underline">
                      ← Change type
                    </button>
                    <span>•</span>
                    <span className="text-white">{selectedType && getIncidentLabel(selectedType)}</span>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Add Photo</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePhotoCapture}
                        className="w-20 h-20 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-gray-400 hover:border-slate-600 transition-colors"
                      >
                        <Camera size={20} />
                        <span className="text-xs mt-1">Camera</span>
                      </button>
                      {photoPreview ? (
                        <div className="relative">
                          <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                          <button
                            onClick={() => setPhotoPreview(null)}
                            className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-gray-500">
                          <Mic size={20} />
                          <span className="text-xs mt-1">Voice</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue in detail..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none resize-none h-24"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Your Name (optional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anonymous"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={14} />
                    <span>Your current location will be attached automatically</span>
                  </div>

                  <button
                    onClick={() => setStep('confirm')}
                    disabled={!description}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-gray-500 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}

              {step === 'confirm' && (
                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedType && getIncidentIcon(selectedType)}</span>
                      <span className="font-medium">{selectedType && getIncidentLabel(selectedType)}</span>
                    </div>
                    <p className="text-sm text-gray-400">{description}</p>
                    <p className="text-xs text-gray-500">📍 {userLocation?.lat.toFixed(4)}, {userLocation?.lng.toFixed(4)}</p>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                    <p className="text-xs text-blue-300">
                      AI will automatically analyze your report for verification and categorization.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('details')}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={16} /> Submit Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

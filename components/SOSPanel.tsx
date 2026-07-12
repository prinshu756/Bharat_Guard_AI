'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MapPin, MessageSquare, Heart, Send, ArrowLeft, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { generateId } from '@/lib/utils'

export default function SOSPanel() {
  const setSidebarView = useAppStore((s) => s.setSidebarView)
  const userLocation = useAppStore((s) => s.userLocation)
  const addSOSRequest = useAppStore((s) => s.addSOSRequest)
  const sosRequests = useAppStore((s) => s.sosRequests)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [medicalInfo, setMedicalInfo] = useState('')
  const [sent, setSent] = useState(false)

  const handleSendSOS = () => {
    addSOSRequest({
      id: generateId(),
      callerName: name || 'Anonymous',
      phoneNumber: phone || 'Not provided',
      location: userLocation || { lat: 22.7196, lng: 75.8577 },
      message: message || 'Emergency! Need immediate assistance.',
      medicalInfo: medicalInfo || undefined,
      timestamp: new Date().toISOString(),
      status: 'pending',
      priority: 'critical',
    })
    setSent(true)
    setTimeout(() => {
      setShowForm(false)
      setSent(false)
      setName('')
      setPhone('')
      setMessage('')
      setMedicalInfo('')
    }, 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarView('list')} className="p-1 hover:bg-slate-700 rounded transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-semibold text-red-400">Emergency SOS</h2>
        </div>
      </div>

      {!showForm && !sent && (
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-center">
            <div className="text-6xl mb-3">🆘</div>
            <p className="text-red-300 text-sm mb-4">
              Send your emergency location and details to rescue authorities immediately.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all animate-pulse shadow-lg shadow-red-600/30"
            >
              <Phone size={24} className="inline mr-2" />
              SEND SOS
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">Recent SOS Requests</h3>
            {sosRequests.filter(r => r.status !== 'resolved').slice(0, 3).map((req) => (
              <div key={req.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{req.callerName}</p>
                    <p className="text-xs text-gray-500">{req.location.address || `${req.location.lat.toFixed(4)}, ${req.location.lng.toFixed(4)}`}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    req.status === 'responding' ? 'bg-green-500/20 text-green-400' :
                    req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && !sent && (
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            <p className="text-xs text-red-300">Your GPS location will be sent with the alert</p>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91-XXXXXXXXXX"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <MessageSquare size={14} /> Emergency Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your emergency..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-red-500 outline-none resize-none h-20"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Heart size={14} /> Medical Information (optional)
            </label>
            <textarea
              value={medicalInfo}
              onChange={(e) => setMedicalInfo(e.target.value)}
              placeholder="Blood type, allergies, medications..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-red-500 outline-none resize-none h-16"
            />
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={14} className="text-red-400" />
            <span>{userLocation?.lat.toFixed(4)}, {userLocation?.lng.toFixed(4)}</span>
          </div>

          <button
            onClick={handleSendSOS}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Send size={20} /> SEND EMERGENCY ALERT
          </button>
        </div>
      )}

      {sent && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-green-900/20 border border-green-700/30 rounded-lg p-8 text-center"
        >
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-green-400 mb-2">SOS Sent Successfully!</h3>
          <p className="text-sm text-green-300">
            Rescue authorities have been notified. Help is on the way.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

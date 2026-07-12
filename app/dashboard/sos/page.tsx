'use client'

import { useState } from 'react'
import { Phone, MapPin, MessageSquare, Heart, Send, AlertTriangle, Shield, CheckCircle2, User } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/lib/auth-store'
import { useAppStore } from '@/lib/store'
import { generateId } from '@/lib/utils'

export default function SOSPage() {
  const { user } = useAuthStore()
  const userLocation = useAppStore((s) => s.userLocation)
  const addSOSRequest = useAppStore((s) => s.addSOSRequest)
  const sosRequests = useAppStore((s) => s.sosRequests)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState(user?.name || '')
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
      setName(user?.name || '')
      setPhone('')
      setMessage('')
      setMedicalInfo('')
    }, 3000)
  }

  return (
    <DashboardLayout userRole="user">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-red-300">Emergency SOS</h1>
          <p className="text-sm text-text-secondary mt-1">Send your location to rescue authorities instantly</p>
        </div>

        {!showForm && !sent && (
          <div className="space-y-4">
            <Card padding="lg" className="text-center">
              <h2 className="text-lg font-semibold mb-2">Need immediate help?</h2>
              <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
                Your GPS location, message, and medical info will be sent to rescue teams.
              </p>
              <Button
                variant="danger"
                size="lg"
                onClick={() => setShowForm(true)}
                className="animate-sos-pulse mx-auto"
              >
                <Phone size={20} />
                Send SOS alert
              </Button>
              <p className="mt-4 text-xs text-text-muted flex items-center justify-center gap-1">
                <AlertTriangle size={12} /> GPS location included automatically
              </p>
            </Card>

            <Card padding="none">
              <div className="p-4 border-b border-surface-border flex items-center justify-between">
                <h3 className="font-medium text-sm">Recent requests</h3>
                <span className="text-xs text-text-muted">{sosRequests.length} total</span>
              </div>
              <div className="divide-y divide-surface-border">
                {sosRequests.slice(0, 5).map((req) => (
                  <div key={req.id} className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-accent-subtle rounded-lg flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{req.callerName}</p>
                        <p className="text-xs text-text-muted truncate">
                          {req.location.address || `${req.location.lat.toFixed(4)}, ${req.location.lng.toFixed(4)}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-text-muted flex-shrink-0 capitalize">{req.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {showForm && !sent && (
          <Card padding="lg" className="space-y-4">
            <div className="bg-accent-subtle border border-red-500/25 rounded-lg p-3 flex items-center gap-3 text-sm">
              <AlertTriangle size={18} className="text-accent flex-shrink-0" />
              <p className="text-red-200">Your GPS location will be included with this alert.</p>
            </div>

            <div>
              <label className="text-sm text-text-secondary mb-1.5 block">Your name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1.5 block">Phone number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91-XXXXXXXXXX" className="input-field" />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1.5 flex items-center gap-1"><MessageSquare size={14} /> Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your emergency…" className="input-field resize-none h-20" />
            </div>
            <div>
              <label className="text-sm text-text-secondary mb-1.5 flex items-center gap-1"><Heart size={14} /> Medical info (optional)</label>
              <textarea value={medicalInfo} onChange={(e) => setMedicalInfo(e.target.value)} placeholder="Blood type, allergies…" className="input-field resize-none h-16" />
            </div>
            <div className="bg-surface-overlay rounded-lg p-3 flex items-center gap-2 text-xs text-text-secondary">
              <MapPin size={14} className="text-accent" />
              {userLocation?.lat.toFixed(4)}, {userLocation?.lng.toFixed(4)}
            </div>
            <Button variant="danger" onClick={handleSendSOS} className="w-full" size="lg">
              <Send size={18} /> Send emergency alert
            </Button>
          </Card>
        )}

        {sent && (
          <Card padding="lg" className="text-center">
            <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-green-400 mb-1">SOS sent</h2>
            <p className="text-sm text-text-secondary mb-4">Rescue authorities have been notified.</p>
            <div className="bg-surface-overlay rounded-lg p-3 text-left text-sm space-y-1">
              <p><span className="text-text-muted">Name:</span> {name}</p>
              <p><span className="text-text-muted">Phone:</span> {phone || 'Not provided'}</p>
              <p><span className="text-text-muted">Location:</span> {userLocation?.lat.toFixed(4)}, {userLocation?.lng.toFixed(4)}</p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

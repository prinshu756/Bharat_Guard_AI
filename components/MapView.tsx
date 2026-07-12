'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useAppStore } from '@/lib/store'
import { getIncidentIcon, formatTimestamp, getMarkerColor } from '@/lib/utils'

function createNumberedIcon(number: number, color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:3px solid rgba(255,255,255,0.9);box-shadow:0 2px 8px rgba(0,0,0,0.4);cursor:pointer;">${number}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  })
}

function MapClickHandler() {
  const setShowReportForm = useAppStore((s) => s.setShowReportForm)
  useMapEvents({
    click: () => {
      setShowReportForm(false)
    },
  })
  return null
}

function MapBoundsUpdater() {
  const map = useMap()
  const incidents = useAppStore((s) => s.incidents)

  useEffect(() => {
    if (incidents.length > 0) {
      const bounds = L.latLngBounds(
        incidents.map((i) => [i.location.lat, i.location.lng] as [number, number])
      )
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
      }
    }
  }, [])

  return null
}

export default function MapView() {
  const incidents = useAppStore((s) => s.incidents)
  const userLocation = useAppStore((s) => s.userLocation)
  const mode = useAppStore((s) => s.mode)
  const emergencyResources = useAppStore((s) => s.emergencyResources)
  const rescueTeams = useAppStore((s) => s.rescueTeams)
  const setSelectedIncident = useAppStore((s) => s.setSelectedIncident)
  const confirmIncident = useAppStore((s) => s.confirmIncident)
  const setSidebarView = useAppStore((s) => s.setSidebarView)

  const handleIncidentClick = useCallback((incident: any) => {
    setSelectedIncident(incident)
    setSidebarView('details')
  }, [setSelectedIncident, setSidebarView])

  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `<div style="background:#3b82f6;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(59,130,246,0.6);"><div style="background:white;width:8px;height:8px;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"></div></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  const shelterIcon = L.divIcon({
    className: 'shelter-marker',
    html: `<div style="background:#22c55e;color:white;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid rgba(255,255,255,0.9);box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏠</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })

  const teamIcon = L.divIcon({
    className: 'team-marker',
    html: `<div style="background:#ef4444;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid white;box-shadow:0 2px 8px rgba(239,68,68,0.5);">🚨</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <MapContainer
        center={[userLocation?.lat || 22.7196, userLocation?.lng || 75.8577]}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        <MapBoundsUpdater />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-sm font-medium">Your Location</div>
            </Popup>
          </Marker>
        )}

        {incidents.map((incident, idx) => (
          <Marker
            key={incident.id}
            position={[incident.location.lat, incident.location.lng]}
            icon={createNumberedIcon(idx + 1, getMarkerColor(incident.severity))}
            eventHandlers={{
              click: () => handleIncidentClick(incident),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getIncidentIcon(incident.type)}</span>
                  <span className="font-semibold text-sm">{incident.title}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{incident.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>{formatTimestamp(incident.reportedAt)}</span>
                  <span>•</span>
                  <span>AI: {incident.aiVerificationScore}%</span>
                </div>
                {incident.suggestedAlternateRoute && (
                  <div className="text-xs text-blue-600 mb-2">↳ {incident.suggestedAlternateRoute}</div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); confirmIncident(incident.id) }}
                  className="w-full text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500 transition-colors"
                >
                  ✓ Confirm ({incident.citizenConfirmations})
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {incidents
          .filter((i) => i.severity === 'critical')
          .map((incident) => (
            <Circle
              key={`circle-${incident.id}`}
              center={[incident.location.lat, incident.location.lng]}
              radius={300}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1 }}
            />
          ))}

        {mode === 'disaster' && (
          <>
            {emergencyResources.map((res) => (
              <Marker
                key={res.id}
                position={[res.location.lat, res.location.lng]}
                icon={shelterIcon}
              >
                <Popup>
                  <div className="font-medium text-sm">{res.name}</div>
                  <div className="text-xs text-gray-600 capitalize">{res.type.replace('_', ' ')}</div>
                  <div className="text-xs text-gray-500">{res.currentOccupancy}/{res.capacity}</div>
                </Popup>
              </Marker>
            ))}
            {rescueTeams.map((team) => (
              <Marker
                key={team.id}
                position={[team.location.lat, team.location.lng]}
                icon={teamIcon}
              >
                <Popup>
                  <div className="font-medium text-sm">{team.name}</div>
                  <div className="text-xs text-gray-600 capitalize">{team.type} • {team.members} members</div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  )
}
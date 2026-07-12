'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Navigation,
  Shield,
  Phone,
  Plus,
  Layers,
  Menu,
  Radio,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import DisasterHeader from './DisasterHeader'
import ReportForm from './ReportForm'
import IncidentPanel from './IncidentPanel'
import NavigationPanel from './NavigationPanel'
import SOSPanel from './SOSPanel'
import ResourcesPanel from './ResourcesPanel'
import ComplaintDashboard from './ComplaintDashboard'

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900">
      <div className="text-gray-400 animate-pulse">Loading map...</div>
    </div>
  ),
})

export default function AppShell() {
  const mode = useAppStore((s) => s.mode)
  const setMode = useAppStore((s) => s.setMode)
  const setShowReportForm = useAppStore((s) => s.setShowReportForm)
  const sidebarView = useAppStore((s) => s.sidebarView)
  const setSidebarView = useAppStore((s) => s.setSidebarView)
  const loadMockData = useAppStore((s) => s.loadMockData)
  const isLoading = useAppStore((s) => s.isLoading)

  useEffect(() => {
    loadMockData()
  }, [loadMockData])

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading Bharat Guardian AI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-gray-100 overflow-hidden">
      <DisasterHeader />

      {/* Top Bar */}
      <header className="flex-shrink-0 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 py-2.5 z-30 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            <h1 className="text-lg font-bold tracking-tight">
              Bharat Guardian <span className="text-red-400">AI</span>
            </h1>
            <span className="text-[10px] text-gray-600 hidden md:inline font-mono">
              Know · Report · Navigate · Rescue
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode(mode === 'normal' ? 'disaster' : 'normal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'disaster'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              <Radio size={12} />
              {mode === 'disaster' ? 'Disaster Mode' : 'Normal Mode'}
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Menu size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Map Layer */}
        <MapView />

        {/* Sidebar (floating over map) */}
        <div className="absolute top-0 left-0 bottom-0 w-full md:w-[400px] lg:w-[440px] pointer-events-none z-20">
          <div className="h-full p-3 pointer-events-none">
            <div className="h-full overflow-y-auto bg-slate-900/85 backdrop-blur-md border border-slate-800/80 rounded-xl shadow-2xl pointer-events-auto">
              <div className="p-4">
                {sidebarView === 'list' && <IncidentPanel />}
                {sidebarView === 'details' && <IncidentPanel />}
                {sidebarView === 'navigation' && <NavigationPanel />}
                {sidebarView === 'sos' && <SOSPanel />}
                {sidebarView === 'resources' && <ResourcesPanel />}
                {sidebarView === 'complaints' && <ComplaintDashboard />}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pointer-events-none">
          <div className="flex items-center justify-center gap-3 pointer-events-auto">
            {mode === 'disaster' && (
              <button
                onClick={() => setSidebarView(sidebarView === 'sos' ? 'list' : 'sos')}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${
                  sidebarView === 'sos'
                    ? 'bg-red-600 text-white shadow-red-600/30 scale-105'
                    : 'bg-slate-800/90 text-gray-300 hover:bg-slate-700'
                }`}
              >
                <Phone size={16} />
                SOS
              </button>
            )}
            <button
              onClick={() => setSidebarView(sidebarView === 'complaints' ? 'list' : 'complaints')}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all shadow-lg ${
                sidebarView === 'complaints'
                  ? 'bg-blue-600 text-white shadow-blue-600/30'
                  : 'bg-slate-800/90 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Shield size={16} />
              Complaints
            </button>
            <button
              onClick={() => setSidebarView(sidebarView === 'navigation' ? 'list' : 'navigation')}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all shadow-lg ${
                sidebarView === 'navigation'
                  ? 'bg-green-600 text-white shadow-green-600/30'
                  : 'bg-slate-800/90 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Navigation size={16} />
              Navigate
            </button>
            {mode === 'disaster' && (
              <button
                onClick={() => setSidebarView(sidebarView === 'resources' ? 'list' : 'resources')}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all shadow-lg ${
                  sidebarView === 'resources'
                    ? 'bg-purple-600 text-white shadow-purple-600/30'
                    : 'bg-slate-800/90 text-gray-300 hover:bg-slate-700'
                }`}
              >
                <Layers size={16} />
                Resources
              </button>
            )}
            <button
              onClick={() => setShowReportForm(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={16} />
              Report
            </button>
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute top-3 right-3 z-10 bg-slate-900/85 backdrop-blur border border-slate-800 rounded-lg p-2 text-xs pointer-events-auto hidden md:block">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-gray-400">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-gray-400">High</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-gray-400">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-gray-400">Low</span>
            </div>
          </div>
        </div>
      </div>

      <ReportForm />
    </div>
  )
}

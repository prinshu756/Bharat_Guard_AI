'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  type AppMode,
  type Incident,
  type Report,
  type Complaint,
  type RouteOption,
  type SOSRequest,
  type EmergencyResource,
  type DisasterAlert,
  type RescueTeam,
  type CitizenReport,
  type Location,
  type IncidentType,
  type Severity,
} from '@/lib/types'
import { generateId } from '@/lib/utils'
import {
  mockIncidents,
  mockReports,
  mockRoutes,
  mockSOSRequests,
  mockEmergencyResources,
  mockDisasterAlerts,
  mockRescueTeams,
  mockCitizenReports,
} from '@/lib/mock-data'

interface AppState {
  mode: AppMode
  userLocation: Location | null
  incidents: Incident[]
  reports: Report[]
  complaints: Complaint[]
  routes: RouteOption[]
  sosRequests: SOSRequest[]
  emergencyResources: EmergencyResource[]
  disasterAlerts: DisasterAlert[]
  rescueTeams: RescueTeam[]
  citizenReports: CitizenReport[]
  selectedIncident: Incident | null
  isLoading: boolean
  showReportForm: boolean
  sidebarView: 'list' | 'details' | 'navigation' | 'resources' | 'sos' | 'complaints'

  setMode: (mode: AppMode) => void
  setUserLocation: (loc: Location) => void
  setIncidents: (incidents: Incident[]) => void
  addIncident: (incident: Incident) => void
  setReports: (reports: Report[]) => void
  addReport: (report: Report) => void
  setComplaints: (complaints: Complaint[]) => void
  updateComplaintStatus: (id: string, status: Complaint['status']) => void
  setRoutes: (routes: RouteOption[]) => void
  addSOSRequest: (req: SOSRequest) => void
  updateSOSStatus: (id: string, status: SOSRequest['status']) => void
  setEmergencyResources: (resources: EmergencyResource[]) => void
  setDisasterAlerts: (alerts: DisasterAlert[]) => void
  setRescueTeams: (teams: RescueTeam[]) => void
  addCitizenReport: (report: CitizenReport) => void
  setSelectedIncident: (incident: Incident | null) => void
  setLoading: (loading: boolean) => void
  setShowReportForm: (show: boolean) => void
  setSidebarView: (view: AppState['sidebarView']) => void
  confirmIncident: (incidentId: string) => void
  createReport: (data: {
    type: IncidentType
    description: string
    location: Location
    photoUrl?: string
    reportedBy: string
  }) => Report
  loadMockData: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      mode: 'normal',
      userLocation: { lat: 22.7196, lng: 75.8577 },
      incidents: [],
      reports: [],
      complaints: [],
      routes: [],
      sosRequests: [],
      emergencyResources: [],
      disasterAlerts: [],
      rescueTeams: [],
      citizenReports: [],
      selectedIncident: null,
      isLoading: true,
      showReportForm: false,
      sidebarView: 'list',

      setMode: (mode) => set({ mode }),
      setUserLocation: (loc) => set({ userLocation: loc }),
      setIncidents: (incidents) => set({ incidents }),
      addIncident: (incident) => set((s) => ({ incidents: [...s.incidents, incident] })),
      setReports: (reports) => set({ reports }),
      addReport: (report) => set((s) => ({ reports: [...s.reports, report] })),
      setComplaints: (complaints) => set({ complaints }),
      updateComplaintStatus: (id, status) =>
        set((s) => ({
          complaints: s.complaints.map((c) => (c.id === id ? { ...c, status } : c)),
        })),
      setRoutes: (routes) => set({ routes }),
      addSOSRequest: (req) => set((s) => ({ sosRequests: [...s.sosRequests, req] })),
      updateSOSStatus: (id, status) =>
        set((s) => ({
          sosRequests: s.sosRequests.map((r) => (r.id === id ? { ...r, status } : r)),
        })),
      setEmergencyResources: (resources) => set({ emergencyResources: resources }),
      setDisasterAlerts: (alerts) => set({ disasterAlerts: alerts }),
      setRescueTeams: (teams) => set({ rescueTeams: teams }),
      addCitizenReport: (report) => set((s) => ({ citizenReports: [...s.citizenReports, report] })),
      setSelectedIncident: (incident) => set({ selectedIncident: incident }),
      setLoading: (loading) => set({ isLoading: loading }),
      setShowReportForm: (show) => set({ showReportForm: show }),
      setSidebarView: (view) => set({ sidebarView: view }),

      confirmIncident: (incidentId) =>
        set((s) => ({
          incidents: s.incidents.map((i) =>
            i.id === incidentId ? { ...i, citizenConfirmations: i.citizenConfirmations + 1 } : i
          ),
        })),

      createReport: (data) => {
        const report: Report = {
          id: generateId(),
          type: data.type,
          description: data.description,
          photoUrl: data.photoUrl,
          location: data.location,
          reportedBy: data.reportedBy,
          reportedAt: new Date().toISOString(),
          aiCategory: data.type,
          aiSeverity: 'medium',
          aiPriorityScore: Math.floor(Math.random() * 40) + 40,
          status: 'submitted',
          citizenConfirmations: 0,
        }
        get().addReport(report)
        const complaint: Complaint = {
          id: report.id,
          type: report.type,
          description: report.description,
          photoUrl: report.photoUrl,
          location: report.location,
          reportedBy: report.reportedBy,
          reportedAt: report.reportedAt,
          status: 'submitted',
          aiCategory: report.aiCategory,
          aiSeverity: report.aiSeverity,
        }
        set((s) => ({ complaints: [...s.complaints, complaint] }))
        return report
      },

      loadMockData: () => {
        set({
          incidents: mockIncidents,
          reports: mockReports,
          routes: mockRoutes,
          sosRequests: mockSOSRequests,
          emergencyResources: mockEmergencyResources,
          disasterAlerts: mockDisasterAlerts,
          rescueTeams: mockRescueTeams,
          citizenReports: mockCitizenReports,
          isLoading: false,
        })
      },
    }),
    {
      name: 'bharat-guardian-app',
      partialize: (state) => ({
        mode: state.mode,
        userLocation: state.userLocation,
        incidents: state.incidents,
        reports: state.reports,
        complaints: state.complaints,
        routes: state.routes,
        sosRequests: state.sosRequests,
        emergencyResources: state.emergencyResources,
        disasterAlerts: state.disasterAlerts,
        rescueTeams: state.rescueTeams,
        citizenReports: state.citizenReports,
      }),
    }
  )
)
export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export type IncidentType =
  | 'traffic_congestion'
  | 'flooded_road'
  | 'waterlogging'
  | 'mud_slippery_road'
  | 'pothole'
  | 'fallen_tree'
  | 'landslide'
  | 'road_blockage'
  | 'broken_bridge'
  | 'fire'
  | 'construction'
  | 'accident'

export type Severity = 'critical' | 'high' | 'medium' | 'low'

export type ReportStatus = 'submitted' | 'under_verification' | 'verified' | 'assigned' | 'work_in_progress' | 'resolved'

export type AppMode = 'normal' | 'disaster'

export type DisasterType = 'flood' | 'cyclone' | 'earthquake' | 'wildfire' | 'landslide' | 'other'

export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface Incident {
  id: string
  type: IncidentType
  severity: Severity
  location: Location
  title: string
  description: string
  imageUrl?: string
  videoUrl?: string
  voiceNoteUrl?: string
  reportedAt: string
  reportedBy: string
  aiVerificationScore: number
  citizenConfirmations: number
  status: ReportStatus
  suggestedAlternateRoute?: string
}

export interface Report {
  id: string
  type: IncidentType
  description: string
  photoUrl?: string
  videoUrl?: string
  voiceNoteUrl?: string
  location: Location
  reportedBy: string
  reportedAt: string
  aiCategory: string
  aiSeverity: Severity
  aiPriorityScore: number
  status: ReportStatus
  assignedTo?: string
  resolvedAt?: string
  citizenConfirmations: number
}

export interface Complaint {
  id: string
  type: IncidentType
  description: string
  photoUrl?: string
  location: Location
  reportedBy: string
  reportedAt: string
  status: ReportStatus
  aiCategory: string
  aiSeverity: Severity
  assignedTo?: string
  resolvedAt?: string
}

export interface RouteOption {
  id: string
  name: string
  from: Location
  to: Location
  distance: string
  estimatedTime: string
  safetyScore: number
  hazards: string[]
  isRecommended: boolean
  color: 'green' | 'yellow' | 'red'
}

export interface SOSRequest {
  id: string
  callerName: string
  phoneNumber: string
  location: Location
  message: string
  medicalInfo?: string
  timestamp: string
  status: 'pending' | 'responding' | 'resolved'
  priority: 'critical' | 'high' | 'medium'
}

export interface EmergencyResource {
  id: string
  type: 'shelter' | 'hospital' | 'food_distribution' | 'water_point' | 'charging_station' | 'medical_camp'
  name: string
  location: Location
  capacity: number
  currentOccupancy: number
  phone?: string
  status: 'available' | 'full' | 'limited'
}

export interface DisasterAlert {
  id: string
  type: DisasterType
  severity: Severity
  location: Location
  title: string
  description: string
  affectedPopulation: number
  timestamp: string
  confidence: number
}

export interface RescueTeam {
  id: string
  name: string
  type: 'ndrf' | 'sdrf' | 'fire' | 'medical' | 'volunteer'
  location: Location
  status: 'available' | 'deployed' | 'returning'
  members: number
  eta?: string
}

export interface CitizenReport {
  id: string
  type: 'people_trapped' | 'missing_person' | 'rescue_required' | 'damaged_building' | 'road_blockage'
  description: string
  location: Location
  reporterName: string
  phoneNumber: string
  timestamp: string
  status: 'received' | 'dispatched' | 'resolved'
}
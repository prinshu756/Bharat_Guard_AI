import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type IncidentType, type Severity, type RouteOption } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSeverityColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    critical: 'from-red-600 to-red-500',
    high: 'from-orange-600 to-orange-500',
    medium: 'from-yellow-600 to-yellow-500',
    low: 'from-blue-600 to-blue-500',
  }
  return colors[severity]
}

export function getSeverityBadge(severity: Severity): string {
  const badges: Record<Severity, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }
  return badges[severity]
}

export function getIncidentIcon(type: IncidentType): string {
  const icons: Record<IncidentType, string> = {
    traffic_congestion: '🚗',
    flooded_road: '🌊',
    waterlogging: '💧',
    mud_slippery_road: '🛣️',
    pothole: '🕳️',
    fallen_tree: '🌳',
    landslide: '⛰️',
    road_blockage: '🚧',
    broken_bridge: '🌉',
    fire: '🔥',
    construction: '🏗️',
    accident: '💥',
  }
  return icons[type]
}

export function getIncidentLabel(type: IncidentType): string {
  const labels: Record<IncidentType, string> = {
    traffic_congestion: 'Traffic Congestion',
    flooded_road: 'Flooded Road',
    waterlogging: 'Waterlogging',
    mud_slippery_road: 'Mud / Slippery Road',
    pothole: 'Pothole',
    fallen_tree: 'Fallen Tree',
    landslide: 'Landslide',
    road_blockage: 'Road Blockage',
    broken_bridge: 'Broken Bridge',
    fire: 'Fire',
    construction: 'Construction Work',
    accident: 'Accident',
  }
  return labels[type]
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    submitted: 'bg-blue-500/20 text-blue-400',
    under_verification: 'bg-yellow-500/20 text-yellow-400',
    verified: 'bg-green-500/20 text-green-400',
    assigned: 'bg-purple-500/20 text-purple-400',
    work_in_progress: 'bg-orange-500/20 text-orange-400',
    resolved: 'bg-green-500/20 text-green-400',
  }
  return colors[status] || colors.submitted
}

export function getSafetyScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

export function getSafetyScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-500/20 border-green-500/30'
  if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30'
  return 'bg-red-500/20 border-red-500/30'
}

export function getSafetyScoreLabel(score: number): string {
  if (score >= 80) return 'Recommended'
  if (score >= 60) return 'Moderate Risk'
  return 'Avoid'
}

export function getRouteColor(score: number): RouteOption['color'] {
  if (score >= 80) return 'green'
  if (score >= 60) return 'yellow'
  return 'red'
}

export function formatTimestamp(ts: string): string {
  const date = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function getMarkerColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#3b82f6',
  }
  return colors[severity]
}
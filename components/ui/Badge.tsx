import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'critical' | 'success' | 'warning' | 'info'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-surface-overlay text-text-secondary border-surface-border',
  critical: 'bg-accent-subtle text-red-300 border-red-500/30',
  success: 'bg-green-500/10 text-green-400 border-green-500/25',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

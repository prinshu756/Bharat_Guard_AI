import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { icon: 28, text: 'text-base' },
  md: { icon: 32, text: 'text-lg' },
  lg: { icon: 40, text: 'text-xl' },
}

export default function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const s = sizes[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="40" height="40" rx="8" fill="#c41e3a" />
        <path
          d="M20 10 L30 16 V26 C30 32 20 37 20 37 C20 37 10 32 10 26 V16 Z"
          fill="white"
          fillOpacity="0.95"
        />
      </svg>
      {showText && (
        <span className={cn('font-semibold tracking-tight text-text-primary', s.text)}>
          Bharat Guardian <span className="text-accent">AI</span>
        </span>
      )}
    </div>
  )
}

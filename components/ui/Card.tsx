import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export default function Card({ className, padding = 'md', children, ...props }: CardProps) {
  return (
    <div className={cn('card', paddingMap[padding], className)} {...props}>
      {children}
    </div>
  )
}

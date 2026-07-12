'use client'

import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  side?: 'bottom' | 'left' | 'right'
  className?: string
}

export default function Sheet({ open, onClose, children, title, side = 'bottom', className }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  if (!open) return null

  const sideClasses = {
    bottom: 'inset-x-0 bottom-0 rounded-t-xl max-h-[85vh] animate-slide-up',
    left: 'inset-y-0 left-0 w-full max-w-sm rounded-r-xl animate-fade-in',
    right: 'inset-y-0 right-0 w-full max-w-sm rounded-l-xl animate-fade-in',
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-label={title}
        className={cn(
          'absolute bg-surface-raised border border-surface-border shadow-elevated overflow-y-auto',
          sideClasses[side],
          className
        )}
      >
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-surface-raised px-4 py-3">
            <h2 className="font-semibold text-text-primary">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost px-2 py-1 text-text-muted hover:text-text-primary"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

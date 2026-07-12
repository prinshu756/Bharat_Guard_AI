'use client'

import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  side?: 'bottom' | 'left' | 'right'
  className?: string
}

const sideVariants = {
  bottom: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
    class: 'inset-x-0 bottom-0 rounded-t-xl max-h-[85vh]',
  },
  left: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    class: 'inset-y-0 left-0 w-full max-w-sm rounded-r-xl',
  },
  right: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
    class: 'inset-y-0 right-0 w-full max-w-sm rounded-l-xl',
  },
}

export default function Sheet({ open, onClose, children, title, side = 'bottom', className }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  const variant = sideVariants[side]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            key="sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="sheet-content"
            role="dialog"
            aria-modal
            aria-label={title}
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className={cn(
              'absolute bg-surface-raised border border-surface-border shadow-elevated overflow-y-auto',
              variant.class,
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

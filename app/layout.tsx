import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bharat Guardian AI - Know. Report. Navigate. Rescue.',
  description: "India's AI-Powered Public Infrastructure & Emergency Intelligence Platform. Real-time road intelligence, civic reporting, and disaster response.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bharat Guardian AI',
  },
}

export const viewport: Viewport = {
  themeColor: '#0c1222',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23c41e3a' width='100' height='100' rx='12'/%3E%3Cpath d='M50 22 L72 35 V58 C72 72 50 82 50 82 C50 82 28 72 28 58 V35 Z' fill='white' opacity='0.95'/%3E%3C/svg%3E" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-surface font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

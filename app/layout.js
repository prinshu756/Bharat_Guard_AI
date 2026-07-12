import './globals.css'

export const metadata = {
  title: 'Bharat Guardian AI - Live Disaster Response',
  description: "India's AI-powered Disaster Intelligence & Emergency Response Platform",
}

export const viewport = {
  themeColor: '#030712',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23dc2626' width='100' height='100'/%3E%3Ctext x='50' y='65' font-size='60' font-weight='bold' text-anchor='middle' fill='white' font-family='system-ui'%3E%26%3C/text%3E%3C/svg%3E" />
      </head>
      <body>{children}</body>
    </html>
  )
}

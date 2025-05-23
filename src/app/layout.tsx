import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    template: '%s | Secret Share',
    default: 'Secret Share - Share Secrets Securely',
  },
  description: 'A secure way to share sensitive information',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{
        background: `linear-gradient(to bottom right, var(--gradient-start), var(--gradient-end))`,
        backgroundAttachment: 'fixed'
      }}>
        <div className="min-h-screen bg-background/80 backdrop-blur-sm">
          {children}
        </div>
      </body>
    </html>
  )
} 
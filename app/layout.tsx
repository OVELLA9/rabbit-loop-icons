import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Icon Builder — Rabbit Loop',
  description: 'Build app icons from emojis, symbols and text. Export at 1024×1024 for iOS and Android.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  )
}

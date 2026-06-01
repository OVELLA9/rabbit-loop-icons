import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://icons.rabbit-loop.com'),
  title:        'Icon Builder — Rabbit Loop',
  description:  'Free browser-based app icon creator. Drag emojis, symbols and text onto a canvas, then export at 1024×1024 ready for iOS and Android. No account required.',
  keywords:     ['app icon maker', 'icon builder', 'iOS icon', 'Android icon', 'app icon generator', 'free icon tool', 'emoji icon', '1024x1024 icon'],
  openGraph: {
    title:       'Icon Builder — Rabbit Loop',
    description: 'Free browser-based app icon creator. Export at 1024×1024 for iOS and Android.',
    url:         'https://icons.rabbit-loop.com',
    siteName:    'Rabbit Loop Icon Builder',
    locale:      'en_AU',
    type:        'website',
    images: [{ url: 'https://auth.rabbit-loop.com/logo.png', width: 512, height: 512, alt: 'Rabbit Loop Icon Builder' }],
  },
  twitter: {
    card:        'summary',
    title:       'Icon Builder — Rabbit Loop',
    description: 'Free browser-based app icon creator. Export at 1024×1024 for iOS and Android.',
    images:      ['https://auth.rabbit-loop.com/logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@700&family=Montserrat:wght@700&family=Nunito:wght@700&family=Oswald:wght@700&family=Playfair+Display:wght@700&family=Poppins:wght@700&family=Space+Grotesk:wght@700&family=Syne:wght@800&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context':          'https://schema.org',
            '@type':             'WebApplication',
            name:                'Icon Builder',
            url:                 'https://icons.rabbit-loop.com',
            description:         'Free browser-based app icon creator. Drag emojis, symbols and text onto a canvas and export at 1024×1024 for iOS and Android.',
            applicationCategory: 'DesignApplication',
            operatingSystem:     'Any',
            browserRequirements: 'Requires a modern browser with HTML5 Canvas support.',
            offers: {
              '@type':        'Offer',
              price:          '0',
              priceCurrency:  'AUD',
              description:    'Free to use. Premium subscription removes the watermark.',
            },
            creator: {
              '@type': 'Organization',
              name:    'Rabbit Loop',
              url:     'https://rabbit-loop.com',
            },
          }) }}
        />
        {children}
      </body>
    </html>
  )
}

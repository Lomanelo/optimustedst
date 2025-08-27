import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Optimus KSA',
  description: 'Discover our online MBA and DBA programs designed for future leaders in KSA.',
  keywords: 'education, UAE education, MBA, DBA, bachelor degree, Middle East, online courses, leadership',
  metadataBase: new URL('https://optimusedu.netlify.app'),
  alternates: {
    canonical: '/',
  },
  icons: [
    {
      url: '/Favicon.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      url: '/Favicon.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      url: '/Favicon.png',
      sizes: '48x48',
      type: 'image/png',
    },
  ],
  openGraph: {
    title: 'OPTIMUS Education - Shaping Tomorrow\'s Leaders',
    description: 'Discover our online MBA and DBA programs designed for future leaders in KSA.',
    url: 'https://optimusedu.netlify.app',
    siteName: 'OPTIMUS Education',
    images: [
      {
        url: 'https://optimusedu.netlify.app/OptimusLogoOnPurple.png',
        width: 800,
        height: 600,
        alt: 'OPTIMUS Education Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OPTIMUS Education - Shaping Tomorrow\'s Leaders',
    description: 'Discover our online MBA and DBA programs designed for future leaders in KSA.',
    images: ['https://optimusedu.netlify.app/OptimusLogoOnPurple.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/Favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/Favicon.png" />
        <link rel="shortcut icon" href="/Favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/Favicon.png" />
        <meta name="msapplication-TileImage" content="/Favicon.png" />
        
        {/* Google tag (gtag.js) */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-ZWEB67BZW9" 
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZWEB67BZW9');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 
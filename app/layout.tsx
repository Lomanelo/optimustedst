import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Script from 'next/script'
import GlobalSchemas from './components/SEO/GlobalSchemas'
import { SITE_CONFIG, PAGE_METADATA } from './lib/seo-config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: PAGE_METADATA.home.title.en,
    template: '%s | OPTIMUS Education KSA'
  },
  description: PAGE_METADATA.home.description.en,
  keywords: SITE_CONFIG.keywords,
  metadataBase: new URL(SITE_CONFIG.domain),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'ar': '/ar',
    }
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
    title: PAGE_METADATA.home.title.en,
    description: PAGE_METADATA.home.description.en,
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.domain}/OptimusLogoOnPurple.png`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_METADATA.home.title.en,
    description: PAGE_METADATA.home.description.en,
    images: [`${SITE_CONFIG.domain}/OptimusLogoOnPurple.png`],
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
  verification: {
    google: 'your-google-verification-code',
  },
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'education',
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
        
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="k4g424vb47jr1htoq224242jbdfjm1" />
        
        {/* Force HTTPS */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        
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
            gtag('config', 'G-ZWEB67BZW9', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </Script>
        
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "YOUR_CLARITY_PROJECT_ID");
          `}
        </Script>
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={inter.className}>
        <Providers>
          <GlobalSchemas />
          {children}
        </Providers>
      </body>
    </html>
  )
} 
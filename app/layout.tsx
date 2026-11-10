
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Gulzar, Noto_Nastaliq_Urdu } from 'next/font/google'
import { SparkleCursor } from '@/components/magic/sparkle-cursor'
import './globals.css'

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-nastaliq',
})

const gulzar = Gulzar({
  subsets: ['arabic'],
  weight: '400',
  variable: '--font-gulzar',
})

export const metadata: Metadata = {
  title: 'مشکیزہ روحانیت | علم و معرفت کا روحانی مرکز',
  description:
    'مشکیزہ روحانیت — اسم اعظم، علم جفر، علم الاعداد، تعویذات، طلسمات اور ورد و وظائف کا روحانی مرکز۔',

  icons: {
    icon: '/mashkeeza-logo.png',
    shortcut: '/mashkeeza-logo.png',
    apple: '/mashkeeza-logo.png',
  },

  openGraph: {
    title: 'مشکیزہ روحانیت',
    description: 'علم و معرفت کا روحانی مرکز',
    images: ['/mashkeeza-logo.png'],
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#070a1f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ur" dir="rtl" className={`${nastaliq.variable} ${gulzar.variable} bg-night`}>
      <body className="font-urdu antialiased bg-night text-gold-light">
        {children}
        <SparkleCursor />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

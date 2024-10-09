import type { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'

import { FootNav } from 'components/FooterContent'
import { HeadNav } from 'components/HeadNav'

import { Toaster } from '@/components/ui/toaster'

import { Providers } from '@/store/providers'

import 'styles/globals.css'

export const metadata: Metadata = {
  title: 'QuizMaster',
  description: 'Create Quiz on any topic with few clicks',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/favicon/android-chrome-192x192.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      url: '/favicon/android-chrome-512x512.png',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </head>
      <body className='antialiased'>
        <NextTopLoader />
        <Providers>
          <div className='app-wrapper'>
            <div className='app-nav-box'>
              <HeadNav />
            </div>
            <main className='app flex-grow'>{children}</main>
            <FootNav />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

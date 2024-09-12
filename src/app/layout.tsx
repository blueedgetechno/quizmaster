import type { Metadata } from 'next'

import { HeadNav } from 'components/HeadNav'

import { Toaster } from '@/components/ui/toaster'

import { Providers } from '@/store/providers'

import 'styles/globals.css'

export const metadata: Metadata = {
  title: 'QuizMaster',
  description: 'QuizTime',
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
        <Providers>
          <div className='app-wrapper overflow-y-scroll md:overflow-y-hidden'>
            <div className='app-nav-box'>
              <HeadNav />
            </div>
            <main className='app flex-grow'>{children}</main>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

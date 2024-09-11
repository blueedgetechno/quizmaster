import type { Metadata } from 'next'

import { HeadNav } from 'components/HeadNav'

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
      <body className='antialiased'>
        <Providers>
          <div className='app-wrapper'>
            <HeadNav />
            <main className='app'>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}

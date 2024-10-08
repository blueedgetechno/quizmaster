'use client'

import Link from 'next/link'

import { UilEnvelopeAlt, UilGithub } from '@iconscout/react-unicons'

import { UilTwitterX } from '@/components/ui/icons'

export const FootNav = () => {
  return (
    <nav className='w-full flex justify-center bg-zinc-900 text-gray-50'>
      <div className='foot-nav flex  gap-y-4 flex-col md:flex-row items-center justify-between font-medium py-4'>
        <span className='text-xs md:text-sm'>Copyright © 2024. Blue Edge. All rights reserved</span>
        <div className='flex items-center gap-x-4 text-sm'>
          <span>Follow:</span>
          <Link href='https://github.com/blueedgetechno' target='_blank'>
            <UilGithub size={20} />
          </Link>
          <Link href='https://twitter.com/blueedgetechno' target='_blank'>
            <UilTwitterX size={20} />
          </Link>
          <span>Contact:</span>
          <Link href='https://twitter.com/blueedgetechno' target='_blank'>
            <UilTwitterX size={20} />
          </Link>
          <Link href='mailto:blueedgetechno@gmail.com' target='_blank'>
            <UilEnvelopeAlt size={20} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

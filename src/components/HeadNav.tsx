'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useAppSelector } from 'store/hooks'

import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui'

export const HeadNav = () => {
  const pathname = usePathname()

  const username = useAppSelector((state) => state.app.username)

  const pfpUrl = `https://api.dicebear.com/9.x/lorelei/png?seed=${username}&flip=true`

  return (
    <nav className='app-nav flex items-center justify-between py-4'>
      <a href='/' className='text-2xl text-blue-500 font-semibold'>
        QuizMaster
      </a>
      <ul className='flex items-center gap-4'>
        <li>
          {pathname !== '/quiz/new' && (
            <Button asChild>
              <Link href='/quiz/new'>Create Quiz</Link>
            </Button>
          )}
          {pathname === '/quiz/new' && <Button onClick={() => window.location.reload()}>Refresh</Button>}
        </li>
        <li className='flex items-center gap-x-2'>
          <Avatar className='w-10 h-10 border-2 border-blue-400'>
            <AvatarImage src={pfpUrl} alt='pfp' />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {/* <span className='hidden md:block'>{username}</span> */}
        </li>
      </ul>
    </nav>
  )
}

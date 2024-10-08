'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MoonIcon, PlusIcon, ReloadIcon, SunIcon } from '@radix-ui/react-icons'
import { useAppSelector } from 'store/hooks'

import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui'

export const HeadNav = () => {
  const [theme, setAppTheme] = useState<string | null>(null)
  const pathname = usePathname()

  const username = useAppSelector((state) => state.app.username)

  const pfpUrl = `https://api.dicebear.com/9.x/lorelei/png?seed=${username}&flip=true`

  const enforceTheme = () => {
    if (!theme) return

    const rootElement = document.querySelector('html')
    if (!rootElement) return

    if (theme === 'light') {
      rootElement.classList.remove('dark')
      rootElement.dataset.theme = 'light'
    } else {
      rootElement.classList.add('dark')
      rootElement.dataset.theme = 'dark'
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('appTheme', newTheme)

    setAppTheme(newTheme)
  }

  useEffect(() => {
    const localAppTheme = localStorage.getItem('appTheme') || 'light'
    setAppTheme(localAppTheme)
  }, [])

  useEffect(() => {
    enforceTheme()
  }, [theme])

  return (
    <nav className='app-nav flex items-center justify-between py-4'>
      <a href='/' className='flex text-2xl text-blue-500 font-semibold'>
        <Image src='/logo.png' width={32} height={32} alt='logo' />
        <span className='-ml-1'>uizMaster</span>
      </a>
      <ul className='flex items-center gap-4'>
        <li>
          {pathname !== '/quiz/new' && (
            <Button asChild>
              <Link href='/quiz/new'>
                <span className='hidden md:block'>Create Quiz</span>
                <PlusIcon className='block md:hidden' width={16} />
              </Link>
            </Button>
          )}
          {pathname === '/quiz/new' && (
            <Button onClick={() => window.location.reload()}>
              <span className='hidden md:block'>Refresh</span>
              <ReloadIcon className='block md:hidden' width={16} />
            </Button>
          )}
        </li>
        <li className='flex items-center'>
          <button onClick={toggleTheme}>
            {theme === 'dark' ? (
              <MoonIcon width={24} height={24} className='text-gray-400' />
            ) : (
              <SunIcon width={24} height={24} className='text-gray-600' />
            )}
          </button>
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

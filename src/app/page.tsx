'use client'

import { useEffect } from 'react'

import Dashboard from 'components/home/dashboard'

import { analytics } from '@/lib/firebase'

export default function Home() {
  useEffect(() => {
    analytics
  }, [])

  return <Dashboard />
}

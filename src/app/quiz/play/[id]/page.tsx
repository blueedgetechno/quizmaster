'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import QuizScreen from '@/components/quiz'

import { useAppSelector } from '@/store/hooks'

import { useToast } from '@/hooks/use-toast'

export default function Screen({ params }: { params: { id: number } }) {
  // TODO: Optimise this
  const task = useAppSelector((state) => state.app.tasks.find((x) => x.id == params.id)) // || { topic: 'Untitled Task' })

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (task) return

    toast({
      variant: 'destructive',
      title: "The Quiz with the given id doesn't exists.",
      description: 'There was a problem with your request.',
    })

    router.push('/')
  }, [task])

  if (!task) return <div className='h-full flex justify-center pt-36'>Quiz not found</div>

  return (
    <div className='h-full'>
      <QuizScreen task={task} />
    </div>
  )
}

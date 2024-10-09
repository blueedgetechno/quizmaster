'use client'

import { useEffect } from 'react'

import { useRouter } from 'nextjs-toploader/app'

import QuizScreen from '@/components/quiz'
import { Button } from '@/components/ui'

import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { useToast } from '@/hooks/use-toast'

export default function Screen({ params }: { params: { id: number } }) {
  // TODO: Optimise this
  const task = useAppSelector((state) => state.app.tasks.find((x) => x.id == params.id))

  const { toast } = useToast()

  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleDelete = () => {
    if (!task) return

    dispatch({
      type: 'app/deleteTask',
      payload: task.id,
    })

    toast({
      title: 'The Quiz got deleted.',
      description: 'done',
    })

    router.push('/')
  }

  useEffect(() => {
    if (task) return

    toast({
      variant: 'destructive',
      title: "The Quiz with the given id doesn't exists.",
      description: 'There was a problem with your request.',
    })

    router.push('/')
  }, [task])

  if (!task) return <div className='h-full flex justify-center py-[20vh]'>Quiz not found</div>
  if ((!task.questions || !task.questions.length) && !task.generationInProgress)
    return (
      <div className='h-full flex justify-center py-[20vh]'>
        <div className='flex flex-col align-center gap-y-4'>
          Questions not generated
          <Button variant='outline' onClick={handleDelete}>
            Delete Quiz
          </Button>
        </div>
      </div>
    )

  return (
    <div className='h-full'>
      <QuizScreen task={task} />
    </div>
  )
}

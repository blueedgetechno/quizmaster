'use client'

import { useMemo } from 'react'

import { Button, Separator } from '@/components/ui'

import { useAppDispatch } from '@/store/hooks'

import { Task } from '@/types'

export const ResultScreen = ({ task }: { task: Task }) => {
  const dispatch = useAppDispatch()

  const [correctResponseCount, incorrectResponseCount] = useMemo(() => {
    const totalQuestions = task.questions.length
    const correctResponseCount = task.questions.filter((x) => x.isCorrect).length
    const incorrectResponseCount = totalQuestions - correctResponseCount

    return [correctResponseCount, incorrectResponseCount]
  }, [task])

  const handleReStart = () => dispatch({ type: 'app/reStartQuiz', payload: task.id })

  return (
    <div className='h-full flex justify-center pt-36'>
      <div className='w-72 flex flex-col'>
        <div className='space-y-1'>
          <h4 className='text-xl font-semibold leading-none'>{task.topic}</h4>
          <p className='text-sm text-muted-foreground'>Grade: {task.grade}</p>
        </div>
        <Separator className='my-4' />
        <div className='flex h-5 justify-between items-center space-x-4 text-sm'>
          <div>
            Total: <strong>{task.questions.length}</strong>
          </div>
          <Separator orientation='vertical' />
          <div>
            Correct: <strong className='text-green-500'>{correctResponseCount}</strong>
          </div>
          <Separator orientation='vertical' />
          <div>
            InCorrect: <strong className='text-red-500'>{incorrectResponseCount}</strong>
          </div>
        </div>
        <div className='my-4'></div>
        <Button onClick={handleReStart} disabled>
          Re-start Quiz | not yet implemented
        </Button>
      </div>
    </div>
  )
}

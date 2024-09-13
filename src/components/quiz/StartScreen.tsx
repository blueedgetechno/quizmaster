'use client'

import { Button, Separator } from '@/components/ui'

import { useAppDispatch } from '@/store/hooks'

import { Task } from '@/types'

export const StartScreen = ({ task }: { task: Task }) => {
  const dispatch = useAppDispatch()

  const handleStart = () => dispatch({ type: 'app/startQuiz', payload: task.id })

  return (
    <div className='h-full flex justify-center pt-[20vh] pb-8'>
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
            Difficulty: <strong>{task.difficulty}</strong>
          </div>
        </div>
        <div className='my-4'></div>
        <Button onClick={handleStart}>Start Quiz</Button>
      </div>
    </div>
  )
}

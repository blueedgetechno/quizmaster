'use client'

import { Player } from '@lottiefiles/react-lottie-player'

import { Button, Separator } from '@/components/ui'

import { useAppDispatch } from '@/store/hooks'

import { Task } from '@/types'

import gradientJson from './lottie/gradient.json'

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
          <div className='flex flex-col items-center'>
            <span className='w-full'>
              {task.generationInProgress ? 'Generating' : 'Total'}: <strong>{task.questions.length}</strong>
              {task.generationInProgress && ` / ${task.intendedLength}`}
            </span>
            {task.generationInProgress && (
              <div className='w-0 h-0 flex flex-col items-center justify-center'>
                <Player
                  className='pt-4'
                  autoplay
                  loop
                  speed={2}
                  src={gradientJson}
                  style={{ height: 250, width: 250 }}
                />
              </div>
            )}
          </div>
          <Separator orientation='vertical' />
          <div>
            Difficulty: <strong>{task.difficulty}</strong>
          </div>
        </div>
        <div className='my-4'></div>
        <div className='relative rounded overflow-hidden'>
          <Button className='w-full' variant={task.generationInProgress ? 'outline' : 'default'} onClick={handleStart}>
            Start Quiz
          </Button>
          {task.generationInProgress && (
            <div
              className='transition-all absolute h-full top-0 left-0 bg-primary flex items-center pointer-events-none overflow-hidden'
              style={{
                width: `${Number((task.questions.length / task.intendedLength) * 100).toFixed(2)}%`,
              }}
            >
              <span className='text-sm text-primary-foreground' style={{ transform: 'translateX(109px)' }}>
                Start Quiz
              </span>
            </div>
          )}
        </div>
        {task.generationInProgress && (
          <div className='text-xs my-4'>
            You can start the quiz. <br />
            It will keep generating in the background.
          </div>
        )}
      </div>
    </div>
  )
}

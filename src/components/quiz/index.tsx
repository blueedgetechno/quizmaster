'use client'

import { Task, TaskState } from '@/types'

import { ResultScreen } from './ResultScreen'
import { StartScreen } from './StartScreen'
import { TakeTestScreen } from './TakeTestScreen'

export const Screen = ({ task }: { task: Task }) => {
  return (
    <div className='h-full'>
      {task.state === TaskState.IDLE && <StartScreen task={task} />}
      {task.questions?.length > 0 && task.state === TaskState.ACTIVE && <TakeTestScreen task={task} />}
      {task.state === TaskState.COMPLETED && <ResultScreen task={task} />}
    </div>
  )
}

export default Screen

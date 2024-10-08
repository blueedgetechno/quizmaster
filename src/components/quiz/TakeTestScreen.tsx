'use client'

import { useMemo } from 'react'

import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

import { Button, Progress } from '@/components/ui'

import { useAppDispatch } from '@/store/hooks'

import { cn } from '@/lib/utils'
import { Task } from '@/types'

export const TakeTestScreen = ({ task }: { task: Task }) => {
  const dispatch = useAppDispatch()

  const ques = useMemo(() => {
    return task.questions[task.resumeIndex]
  }, [task.questions, task.resumeIndex])

  const handleSelect = (choice: number) => {
    if (!!ques.userResponse) return

    dispatch({
      type: 'app/answerQuestion',
      payload: {
        taskId: task.id,
        questionIndex: task.resumeIndex,
        userResponse: choice,
      },
    })
  }

  const handleContinue = () => {
    if (!ques.userResponse) return

    dispatch({
      type: 'app/nextQuestion',
      payload: task.id,
    })
  }

  const stillLoading = task.generationInProgress && task.resumeIndex + 1 === task.questions.length

  const isNextDisabled = !ques.userResponse || stillLoading

  return (
    <div className='relative h-full flex justify-center gap-x-2 pt-8 md:pt-16 pb-8'>
      <Progress
        value={(100 * (task.resumeIndex + 1)) / task.questions.length}
        className='absolute top-0 w-full bg-transparent'
        indicatorClassName='bg-blue-400'
      />
      <h2 className='text-xl md:text-2xl font-bold'>{task.resumeIndex + 1}.</h2>
      <div className='flex flex-col flex-grow'>
        <div className='pl-2 md:pl-6 mb-4 md:mb-8'>
          <p className='mt-px text-xl md:text-2xl'>{ques.question}</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 justify-between gap-x-1 gap-y-2 md:gap-y-1 md:pr-8'>
          {ques.choices.map((choice, i) => {
            const isSelected = ques.userResponse != null
            const selectedMe = isSelected && ques.userResponse === i + 1
            const isCorrect = ques.correctResponse === i + 1

            return (
              <button
                disabled={isSelected}
                key={i}
                onClick={(e) => {
                  e.currentTarget.blur()
                  handleSelect(i + 1)
                }}
              >
                <div
                  className={cn(
                    'flex items-start h-full gap-x-6 p-4 md:p-6 rounded-md',
                    !isSelected && 'hover:bg-gray-200 hover:dark:bg-zinc-900',
                    isSelected && isCorrect && 'bg-emerald-400 dark:bg-emerald-600 text-gray-50 font-medium',
                    selectedMe && !isCorrect && 'border border-4 border-red-300 dark:border-red-800'
                  )}
                >
                  <span className='text-xl'>
                    {String.fromCharCode(97 + i)}
                    {')'}
                  </span>
                  <p className='text-xl md:text-2xl text-left flex-grow'>{choice}</p>
                  <i>
                    {selectedMe && !isCorrect && <Cross2Icon className='text-red-500' width={28} height={28} />}
                    {isSelected && isCorrect && <CheckIcon className='text-gray-50' width={32} height={32} />}
                  </i>
                </div>
              </button>
            )
          })}
        </div>
        {ques.userResponse != null && (
          <div className='flex flex-col md:flex-row mt-8 md:mt-16 gap-x-4 text-lg'>
            <span className='font-semibold'>Explanation:</span>
            <p>{ques.explanation}</p>
          </div>
        )}
        <div className='flex md:justify-end py-12 md:py-24 pr-4 md:pr-8'>
          <Button className='w-full md:w-32' onClick={handleContinue} disabled={isNextDisabled}>
            {!stillLoading ? (task.resumeIndex + 1 === task.questions.length ? 'Submit' : 'Continue') : 'Loading...'}
          </Button>
        </div>
      </div>
    </div>
  )
}

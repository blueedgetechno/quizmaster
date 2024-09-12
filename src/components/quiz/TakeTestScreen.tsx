'use client'

import { useMemo } from 'react'

import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui'

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

  return (
    <div className='h-full flex justify-center gap-x-2 pt-8 md:pt-16'>
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
              <div
                className={cn(
                  'flex items-center gap-x-6 p-4 md:p-6 rounded-md',
                  !isSelected && 'hover:bg-gray-200',
                  isSelected && isCorrect && 'bg-emerald-400 text-gray-50 font-medium',
                  selectedMe && !isCorrect && 'border border-4 border-red-300'
                )}
                onClick={() => handleSelect(i + 1)}
                key={i}
              >
                <span className='text-xl'>
                  {String.fromCharCode(97 + i)}
                  {')'}
                </span>
                <p className='text-xl md:text-2xl flex-grow'>{choice}</p>
                <i>
                  {selectedMe && !isCorrect && <Cross2Icon className='text-red-500' width={28} height={28} />}
                  {isSelected && isCorrect && <CheckIcon className='text-gray-50' width={32} height={32} />}
                </i>
              </div>
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
          <Button className='w-full md:w-32' onClick={handleContinue} disabled={!ques.userResponse}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

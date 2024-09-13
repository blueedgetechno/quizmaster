'use client'

import { useMemo } from 'react'

import { Label, Pie, PieChart } from 'recharts'

import { Button, Separator } from '@/components/ui'
import { ChartContainer } from '@/components/ui/chart'

import { useAppDispatch } from '@/store/hooks'

import { cn } from '@/lib/utils'
import { Task } from '@/types'

export const ResultScreen = ({ task }: { task: Task }) => {
  const dispatch = useAppDispatch()

  const [totalQuestions, correctResponseCount, incorrectResponseCount] = useMemo(() => {
    const totalQuestions = task.questions.length
    const correctResponseCount = task.questions.filter((x) => x.isCorrect).length
    const incorrectResponseCount = totalQuestions - correctResponseCount

    return [totalQuestions, correctResponseCount, incorrectResponseCount]
  }, [task])

  const chartData = [
    { type: 'correct', count: correctResponseCount, fill: 'hsl(var(--chart-2))' },
    { type: 'incorrect', count: incorrectResponseCount, fill: 'hsl(var(--chart-1))' },
  ]

  const handleReStart = () => dispatch({ type: 'app/reStartQuiz', payload: task.id })

  return (
    <div className='h-full flex justify-center py-[12vh]'>
      <div className='w-72 flex flex-col'>
        <div className='space-y-1'>
          <h4 className='text-xl font-semibold leading-none'>{task.topic}</h4>
          <p className='text-sm'>
            Grade: <strong>{task.grade}</strong>
          </p>
        </div>
        <div>
          <ChartContainer config={{}} className='mx-auto aspect-square'>
            <PieChart>
              <Pie
                data={chartData}
                nameKey='type'
                dataKey='count'
                startAngle={90}
                endAngle={-270}
                innerRadius={84}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                          <tspan className='fill-teal-500 text-4xl font-medium'>{correctResponseCount}</tspan>
                          <tspan className='fill-gray-400 text-lg font-medium'> / </tspan>
                          <tspan className='fill-gray-400 text-xl font-medium'>{totalQuestions}</tspan>
                        </text>
                      )
                    } else {
                      return (
                        <text textAnchor='middle' dominantBaseline='middle'>
                          {correctResponseCount} / {totalQuestions}
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        <Separator className='mb-4' />
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
        <div className='flex flex-wrap gap-2 my-4'>
          {task.questions.map((question, i) => (
            <div
              key={i}
              className={cn(
                'w-6 h-6 text-xs text-gray-50 grid place-items-center rounded-full',
                question.isCorrect ? 'bg-green-400' : 'bg-red-400'
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className='my-2'></div>
        <Button onClick={handleReStart}>Re-start Quiz</Button>
      </div>
    </div>
  )
}

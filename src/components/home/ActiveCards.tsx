'use client'

import { useEffect, useMemo } from 'react'

import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

import { fetchImage } from '@/store/actions/app'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { LOAD_COUNT } from '@/consts'
import { minifyDate } from '@/lib/utils'
import { Task, TaskState } from '@/types'

const TopicCard = ({ task }: { task: Task }) => {
  return (
    <Link className='p-1 cursor-pointer' href={`/quiz/play/${task.id}`}>
      <Card>
        <div
          className='relative rounded-lg overflow-hidden bg-gradient-to-r from-sky-500 to-indigo-500'
          style={{ height: 240 }}
        >
          {task.image?.thumbnailUrl && (
            <img
              className='w-full h-full object-cover object-top'
              src={task.image.thumbnailUrl}
              width='100%'
              height={240}
              alt={''}
            />
          )}
          <div
            className='absolute bottom-0 w-full pl-4 py-2 text-gray-50'
            style={{ background: '#' + (task.image?.accentColor || '020202') }}
          >
            <h2 className='font-bold drop-shadow-sm tracking-wide truncate'>{task.topic}</h2>
            <p className='text-xs font-normal'>{minifyDate(task.lastEdited)}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export function Screen() {
  const tasks = useAppSelector((state) => state.app.tasks)
  const dispatch = useAppDispatch()

  const filteredTasks = useMemo(() => {
    return [...tasks]
      .filter((t) => [TaskState.ACTIVE, TaskState.IDLE].includes(t.state))
      .sort((a, b) => {
        return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
      })
      .slice(0, LOAD_COUNT)
  }, [tasks])

  useEffect(() => {
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]

      if (task.image) continue

      dispatch(fetchImage(task))
    }
  }, [tasks.length])

  return (
    filteredTasks.length > 0 && (
      <div className='w-full md:w-auto pb-8'>
        <h2 className='text-xl font-semibold mb-4'>Resume</h2>
        <div>
          <Carousel className='ml-8 md:ml-4 w-4/5' opts={{ align: 'start' }}>
            <CarouselContent>
              {filteredTasks.map((task) => (
                <CarouselItem key={task.id} className='md:basis-1/2 lg:basis-1/3'>
                  <TopicCard task={task} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    )
  )
}

export default Screen

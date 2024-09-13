'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Player } from '@lottiefiles/react-lottie-player'

import { Button, Input, Label, NumInput } from '@/components/ui'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { createTask } from '@/store/actions/app'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { EducationLevels } from '@/consts'
import { useToast } from '@/hooks/use-toast'
import { useAsync } from '@/lib/utils'
import { Task, TaskDifficultyLevels } from '@/types'

import loaderJson from './loader.json'

const FormBox = ({ onSubmit, show }: { onSubmit: (task: Partial<Task>) => void; show: boolean }) => {
  const education = useAppSelector((state) => state.app.education)

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const task = Object.fromEntries(new FormData(e.currentTarget).entries())
    onSubmit(task)
  }

  return (
    <form className={show ? 'block' : 'hidden'} onSubmit={handleSubmit}>
      <Card className='w-full md:w-[480px]'>
        <CardHeader>
          <CardTitle>Create Quiz</CardTitle>
          <CardDescription>Create your quiz with few easy steps.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid w-full items-center gap-8'>
            <div className='flex space-x-2'>
              <div className='w-auto md:w-3/4 flex flex-col space-y-1.5'>
                <Label htmlFor='topic'>Topic *</Label>
                <Input name='topic' required placeholder='Topic of the Quiz' />
              </div>
              <div className='flex-1 flex flex-col space-y-1.5'>
                <Label htmlFor='count'>Count *</Label>
                <NumInput name='count' min={5} max={20} step={5} required defaultValue={5} />
              </div>
            </div>
            <div className='flex space-x-2'>
              <div className='flex-1 flex flex-col space-y-1.5'>
                <Label htmlFor='grade'>Grade *</Label>
                <Select required defaultValue={education.grade || EducationLevels[0]} name='grade'>
                  <SelectTrigger id='grade'>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {EducationLevels.map((level) => (
                      <SelectItem value={level} key={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex-1 flex flex-col space-y-1.5'>
                <Label htmlFor='difficulty'>Difficulty</Label>
                <Select required defaultValue={TaskDifficultyLevels.MEDIUM} name='difficulty'>
                  <SelectTrigger id='difficulty'>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {Object.values(TaskDifficultyLevels).map((level) => (
                      <SelectItem className='capitalize' value={level} key={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' onClick={() => router.back()}>
            Back
          </Button>
          <Button type='submit'>Create</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

const CreateQuiz = ({ task, resetTask }: { task: Partial<Task> | undefined; resetTask: () => void }) => {
  const { isLoading, error, data, callFn } = useAsync<Task>()

  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (data == null) return

    dispatch({ type: 'app/addTask', payload: JSON.parse(JSON.stringify(data)) })
    router.push(`/quiz/play/${data.id}`)
  }, [data])

  useEffect(() => {
    if (error == null) return

    toast({
      variant: 'destructive',
      title: 'Unable to create quiz. Please try again.',
      description: String(error),
    })

    if (resetTask) resetTask()
  }, [error])

  useEffect(() => {
    if (!task) return

    callFn(() => createTask(task))
  }, [task])

  if (task == null) return null

  return (
    <div className='h-full flex flex-col items-center'>
      <h2 className={`text-lg font-medium text-gray-600 ${error ? 'text-red-600' : ''}`}>
        {isLoading
          ? 'Hold on for a second...'
          : error
            ? 'Error creating quiz. Please try again.'
            : 'Done. Wait for redirection...'}
      </h2>
      <Player autoplay loop src={loaderJson} style={{ height: 360, width: 360 }} />
    </div>
  )
}

export default function CreateScreen() {
  const [task, setTask] = useState<Partial<Task>>()

  return (
    <>
      {<FormBox show={task == null} onSubmit={(data) => setTask(data)}></FormBox>}
      <CreateQuiz task={task} resetTask={() => setTask(undefined)}></CreateQuiz>
    </>
  )
}

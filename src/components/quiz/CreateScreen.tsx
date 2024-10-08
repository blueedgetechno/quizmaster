'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Player } from '@lottiefiles/react-lottie-player'
import { InfoCircledIcon } from '@radix-ui/react-icons'

import { Button, Input, Label, NumInput } from '@/components/ui'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { createTask } from '@/store/actions/app'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { EducationLevels, GenModels } from '@/consts'
import { useToast } from '@/hooks/use-toast'
import { useAsync } from '@/lib/utils'
import { InformalTask, TaskDifficultyLevels } from '@/types'

import loaderJson from './lottie/loader.json'

interface ModifiedInformalTask extends InformalTask {
  model?: string
}

const FormBox = ({ onSubmit, show }: { onSubmit: (task: ModifiedInformalTask) => void; show: boolean }) => {
  const education = useAppSelector((state) => state.app.education)
  const choiceOfModel = useAppSelector((state) => state.app.model)

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const task: ModifiedInformalTask = Object.fromEntries(new FormData(e.currentTarget).entries())
    onSubmit(task)
  }

  return (
    <form className={show ? 'block' : 'hidden'} onSubmit={handleSubmit}>
      <Card className='w-full md:w-[480px] dark:bg-zinc-900'>
        <CardHeader>
          <CardTitle>
            <div className='flex items-center justify-between'>
              <span>Create Quiz</span>
              <div className='flex items-center gap-x-1'>
                <Select
                  required
                  defaultValue={GenModels.includes(choiceOfModel) ? choiceOfModel : GenModels[0]}
                  name='model'
                >
                  <SelectTrigger className='w-auto pr-0 shadow-none border-none font-normal' id='model'>
                    <SelectValue placeholder='model' />
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {GenModels.map((model) => (
                      <SelectItem value={model} key={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger onClick={(e) => e.preventDefault()}>
                      <InfoCircledIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI Model used to generate the quiz.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardTitle>
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

const CreateQuiz = (props: { task: ModifiedInformalTask | undefined; resetTask: () => void }) => {
  const { isLoading, error, data: taskId, callFn } = useAsync<number>()

  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (taskId == null || isLoading) return

    router.push(`/quiz/play/${taskId}`)
  }, [taskId, isLoading])

  useEffect(() => {
    if (error == null) return

    toast({
      variant: 'destructive',
      title: 'Unable to create quiz. Please try again.',
      description: String(error),
    })

    if (props.resetTask) props.resetTask()
  }, [error])

  useEffect(() => {
    if (!props.task) return

    callFn(() => createTask(props.task!, dispatch))
  }, [props.task])

  if (props.task == null) return null

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
  const [task, setTask] = useState<ModifiedInformalTask>()

  return (
    <>
      <FormBox show={task == null} onSubmit={(data) => setTask(data)} />
      <CreateQuiz task={task} resetTask={() => setTask(undefined)}></CreateQuiz>
    </>
  )
}

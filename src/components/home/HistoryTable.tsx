'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  CheckCircledIcon,
  DotsVerticalIcon,
  EraserIcon,
  PlayIcon,
  RadiobuttonIcon,
  ResumeIcon,
} from '@radix-ui/react-icons'

import { Button, Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { minifyDate } from '@/lib/utils'
import { InformalTask, TaskState, TaskStateOrder, TaskStateText } from '@/types'

const DotsMenu = (props: { children: React.ReactNode; id: number; state: TaskState }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleContinueTask = () => {
    router.push(`/quiz/play/${props.id}`)
  }

  const handleDeleteTask = () => {
    dispatch({
      type: 'app/deleteTask',
      payload: props.id,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='p-1 focus:outline-blue-500'>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='start'>
        <DropdownMenuItem className='text-xs font-medium' onClick={handleContinueTask}>
          {(props.state === TaskState.IDLE || props.state === TaskState.ACTIVE) && (
            <>
              Continue
              <DropdownMenuShortcut>
                <PlayIcon className='text-blue-600' />
              </DropdownMenuShortcut>
            </>
          )}
          {props.state === TaskState.COMPLETED && (
            <>
              Result
              <DropdownMenuShortcut>
                <CheckCircledIcon className='text-green-700' />
              </DropdownMenuShortcut>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className='text-xs font-medium' onClick={handleDeleteTask}>
          Delete
          <DropdownMenuShortcut>
            <EraserIcon className='text-red-600' />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Screen() {
  const tasks = useAppSelector((state) => state.app.tasks)

  return (
    <div className='w-full md:w-auto'>
      <h2 className='text-xl font-semibold mb-4'>History</h2>
      <div className='border border-2 border-gray-200 rounded-md'>
        <Table className='w-max h-max overflow-hidden'>
          <TableHeader>
            <TableRow className='bg-gray-200'>
              <TableHead>S.No.</TableHead>
              <TableHead className='w-96'>Topic</TableHead>
              <TableHead className='text-center md:text-left md:w-36'>Status</TableHead>
              <TableHead>Last Acted</TableHead>
              <TableHead className='text-right'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 &&
              [...tasks]
                .sort((a, b) => {
                  if (a.state === b.state) {
                    return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
                  }

                  return TaskStateOrder[a.state] - TaskStateOrder[b.state]
                })
                .map((task, i) => (
                  <TableRow key={task.id}>
                    <TableCell className='font-medium'>&nbsp;{i + 1}.</TableCell>
                    <TableCell>{task.topic}</TableCell>
                    <TableCell>
                      <span className='flex items-center justify-end md:justify-start gap-x-2'>
                        <p>{TaskStateText[task.state]}</p>
                        {task.state === TaskState.COMPLETED && <CheckCircledIcon className='w-4 h-4 text-green-500' />}
                        {task.state === TaskState.ACTIVE && <ResumeIcon className='w-4 h-4 text-yellow-500' />}
                        {task.state === TaskState.IDLE && <RadiobuttonIcon className='w-4 h-4 text-blue-500' />}
                      </span>
                    </TableCell>
                    <TableCell>{minifyDate(task.lastEdited)}</TableCell>
                    <TableCell className='h-full flex items-center text-right'>
                      <DotsMenu id={task.id} state={task.state}>
                        <DotsVerticalIcon />
                      </DotsMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
          <TableFooter>
            {tasks.length === 0 && (
              <TableRow>
                <TableCell></TableCell>
                <TableCell colSpan={1}>No Quiz spree so far..</TableCell>
                <TableCell>
                  <Button asChild>
                    <Link href='/quiz/new'>Create Quiz</Link>
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}

export default Screen

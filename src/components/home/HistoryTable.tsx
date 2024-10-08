'use client'

import { useMemo, useState } from 'react'

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

import {
  Button,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { LOAD_COUNT } from '@/consts'
import { minifyDate } from '@/lib/utils'
import { TaskState, TaskStateOrder, TaskStateText } from '@/types'

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
      <DropdownMenuTrigger className='p-0 focus:outline-blue-500'>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent className='p-0' side='bottom' align='start'>
        <DropdownMenuItem className='p-2 text-xs font-medium' onClick={handleContinueTask}>
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
        <Separator />
        <DropdownMenuItem className='p-2 text-xs font-medium' onClick={handleDeleteTask}>
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
  const [loadedCount, setLoadedCount] = useState(LOAD_COUNT)

  const tasks = useAppSelector((state) => state.app.tasks)
  const sortedTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        if (a.state === b.state) {
          return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
        }

        return TaskStateOrder[a.state] - TaskStateOrder[b.state]
      })
      .slice(0, loadedCount)
  }, [tasks, loadedCount])

  const router = useRouter()
  const handleClick = (id: number) => {
    router.push(`/quiz/play/${id}`)
  }

  const handleLoadMore = () => setLoadedCount((prev) => prev + LOAD_COUNT)

  return (
    <div className='w-full md:w-auto'>
      <h2 className='text-xl font-semibold mb-4'>History</h2>
      <div className='border border-2 border-gray-200 dark:border-zinc-900 rounded-md'>
        <Table className='w-max h-max overflow-hidden'>
          <TableHeader>
            <TableRow className='bg-gray-200 dark:bg-zinc-900'>
              <TableHead>S.No.</TableHead>
              <TableHead className='w-96'>Topic</TableHead>
              <TableHead className='text-center md:text-left md:w-36'>Status</TableHead>
              <TableHead>Last Acted</TableHead>
              <TableHead className='text-right'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 &&
              sortedTasks.map((task, i) => (
                <TableRow key={task.id}>
                  <TableCell className='font-medium'>&nbsp;{i + 1}.</TableCell>
                  <TableCell className='cursor-pointer' onClick={() => handleClick(task.id)}>
                    {task.topic}
                  </TableCell>
                  <TableCell className='cursor-pointer' onClick={() => handleClick(task.id)}>
                    <span className='flex items-center justify-end md:justify-start gap-x-2'>
                      <p>{TaskStateText[task.state]}</p>
                      {task.state === TaskState.COMPLETED && <CheckCircledIcon className='w-4 h-4 text-green-500' />}
                      {task.state === TaskState.ACTIVE && <ResumeIcon className='w-4 h-4 text-yellow-500' />}
                      {task.state === TaskState.IDLE && <RadiobuttonIcon className='w-4 h-4 text-blue-500' />}
                    </span>
                  </TableCell>
                  <TableCell className='cursor-pointer' onClick={() => handleClick(task.id)}>
                    {minifyDate(task.lastEdited)}
                  </TableCell>
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
                <TableCell />
                <TableCell colSpan={1}>No Quiz spree so far..</TableCell>
                <TableCell />
                <TableCell>
                  <Button asChild>
                    <Link href='/quiz/new'>Create Quiz</Link>
                  </Button>
                </TableCell>
                <TableCell />
              </TableRow>
            )}
            {tasks.length > 0 && tasks.length > loadedCount && (
              <TableRow className='cursor-pointer' onClick={handleLoadMore}>
                <TableCell />
                <TableCell colSpan={3} className='text-left md:text-center'>
                  <span>Load More</span>
                </TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}

export default Screen

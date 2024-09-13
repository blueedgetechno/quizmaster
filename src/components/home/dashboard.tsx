'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { CheckCircledIcon, RadiobuttonIcon, ResumeIcon } from '@radix-ui/react-icons'

import { Button, Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui'

import { useAppSelector } from '@/store/hooks'

import { minifyDate } from '@/lib/utils'
import { TaskState, TaskStateOrder, TaskStateText } from '@/types'

export function Screen() {
  const tasks = useAppSelector((state) => state.app.tasks)
  const router = useRouter()

  return (
    <div className='h-full px-2 py-8'>
      <div className='flex'>
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
                  tasks
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
                            {task.state === TaskState.COMPLETED && (
                              <CheckCircledIcon className='w-4 h-4 text-green-500' />
                            )}
                            {task.state === TaskState.ACTIVE && <ResumeIcon className='w-4 h-4 text-yellow-500' />}
                            {task.state === TaskState.IDLE && <RadiobuttonIcon className='w-4 h-4 text-blue-500' />}
                          </span>
                        </TableCell>
                        <TableCell>{minifyDate(task.lastEdited)}</TableCell>
                        <TableCell className='text-right'>
                          {(task.state === TaskState.IDLE || task.state === TaskState.ACTIVE) && (
                            <Button
                              size='sm'
                              className='bg-blue-400 rounded-full'
                              onClick={() => router.push(`/quiz/play/${task.id}`)}
                              asChild
                            >
                              <Link href={`/quiz/play/${task.id}`}>Continue</Link>
                            </Button>
                          )}
                          {task.state === TaskState.COMPLETED && (
                            <Button size='sm' className='text-primary rounded-full' variant='link' asChild>
                              <Link href={`/quiz/play/${task.id}`}>
                                <u>Result</u>
                              </Link>
                            </Button>
                          )}
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
        <div className=''></div>
      </div>
    </div>
  )
}

export default Screen

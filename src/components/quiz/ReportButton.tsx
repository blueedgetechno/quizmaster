'use client'

import { useState } from 'react'

import { CheckIcon } from '@radix-ui/react-icons'
import * as Sentry from '@sentry/nextjs'
import { useAppSelector } from 'store/hooks'

import { Button, Label, Textarea } from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UilFlag, UilSpinner } from '@/components/ui/icons'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useToast } from '@/hooks/use-toast'
import { splitAndCapitalize } from '@/lib/utils'
import { Question, Task } from '@/types'

const reportTypes = [
  'wrong-correct-option',
  'missing-option',
  'wrong-explanation',
  'options-not-in-order',
  'invalid-question',
  'other',
]

interface IReport {
  type: string
  message: string
}

const ReportButton = ({ question }: { task?: Task; question: Question }) => {
  const username = useAppSelector((state) => state.app.username)

  const [open, setOpen] = useState(false)
  const [report, setReport] = useState<IReport | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const eventId = Sentry.captureMessage('User Feedback')

      Sentry.captureFeedback({
        name: username,
        message: JSON.stringify({ report, question }),
        associatedEventId: eventId,
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOpen(false)
      toast({
        variant: 'success',
        title: 'Report submitted.',
      })
    } catch (error) {
      console.error('Failed to submit Report:', error)
      toast({
        variant: 'destructive',
        title: 'Failed to Submit. Please try again.',
        description: String(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRadioChange = (value: string) => {
    setReport({ type: value, message: splitAndCapitalize(value) })
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReport({
      type: 'other',
      message: e.target.value,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='text-red-500' variant='ghost'>
          <UilFlag size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-card sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Report!</DialogTitle>
            <DialogDescription>Report any issues with generated content.</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <RadioGroup className='gap-y-4' onValueChange={handleRadioChange}>
              {reportTypes.map((type) => (
                <div className='flex items-center space-x-2' key={type}>
                  <RadioGroupItem value={type} id={'r-' + type} />
                  <Label htmlFor={'r-' + type}>{splitAndCapitalize(type)}</Label>
                </div>
              ))}
            </RadioGroup>
            {report?.type === 'other' && (
              <Textarea name='message' required placeholder='Type your message here.' onChange={handleMessageChange} />
            )}
          </div>
          <DialogFooter>
            <Button disabled={isSubmitting || Boolean(report?.type == null)} type='submit'>
              {isSubmitting ? <UilSpinner size={24} /> : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ReportButton

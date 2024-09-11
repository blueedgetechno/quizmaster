'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'

// import { Button, Input } from '@/components/ui'

// import { createQuiz } from '@/store/quiz'

export const Screen = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-semibold mb-4'>Create a Quiz</h1>
      {/* <QuizForm /> */}
    </div>
  )
}

export default Screen

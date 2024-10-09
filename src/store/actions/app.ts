import { createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'axios'

import type { AppDispatch } from '@/store'

import { InformalTask, Question, Task, TaskDifficultyLevels, TaskState } from '@/types'

const validateQuestion = (x: Question) => {
  if (!x) throw 'Invalid question object'

  if (!x.question || !x.question.length) throw 'Invalid question string'

  if (!x.choices || !x.choices.length) throw 'Invalid choices array'
  if (x.choices.some((x) => x == null)) throw 'Invalid choice string'

  if (x.correctResponse == null) throw 'Invalid correctResponse'
  if (x.correctResponse < 0 || x.correctResponse > x.choices.length) throw 'Invalid correctResponse'

  return true
}

const filterValid = (x: Question) => {
  try {
    validateQuestion(x)

    return true
  } catch (e) {
    console.log('Invalid:', e, x)
    return false
  }
}

// INFO: We are resorting to using fetch because axios doesn't support
// EventStream on POST request in browser, even in 2024
export const createTask = async (task: InformalTask & { model?: string }, dispatch: AppDispatch) => {
  dispatch({
    type: 'app/updateChoiceOfModel',
    payload: task.model,
  })

  return new Promise<number>(async (resolve, reject) => {
    let resolved = false
    const taskId = Math.floor(Math.random() * 1e7)

    try {
      // calling the API
      const response = await fetch('/api/create-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(task),
      })

      // handling the error response
      if (!response.ok || !response.body) {
        const errorBody = (await response.json()) || { message: 'Unknown error' }
        return reject(JSON.stringify(errorBody))
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      const HARD_LIMIT = 1e5
      let i = 0

      // reading the response stream
      while (true) {
        if (i++ > HARD_LIMIT) {
          console.log('[ERROR] Hard limit reached')
          break
        }

        const { done, value } = await reader.read()

        if (done) break

        // decoding the response stream
        const chunk = decoder.decode(value, { stream: true })
        let responseData = [] as Question[]

        try {
          responseData = JSON.parse(chunk.toString()) as Question[]
        } catch (e) {
          console.log('[ERROR] JSON.parse:', e)
          continue
        }

        // filtering the valid questions
        const quesData = responseData.filter(filterValid).map((q) => ({
          ...q,
          explanation: q.explanation || '',
          userResponse: null,
          isCorrect: null,
        }))

        if (!resolved) {
          // adding the task
          dispatch({
            type: 'app/addTask',
            payload: {
              id: taskId,
              topic: task.topic?.substring(0, 44) || 'Untitled Task',

              createdAt: new Date().toISOString(),
              lastEdited: new Date().toISOString(),
              generationInProgress: true,

              questions: quesData,
              intendedLength: task.count,

              resumeIndex: 0,

              grade: task.grade || '',
              state: TaskState.IDLE,
              difficulty: task.difficulty || TaskDifficultyLevels.MEDIUM,
            } as Task,
          })

          resolve(taskId)
        } else {
          // updating the next questions
          dispatch({
            type: 'app/updateTask',
            payload: {
              id: taskId,
              questions: quesData,
            },
          })
        }

        resolved = true
      }
    } catch (e) {
      console.log('[ERROR] Task Creation:', e)
      reject(e)
    }

    if (!resolved) reject('Unknown error')

    dispatch({
      type: 'app/updateTask',
      payload: {
        id: taskId,
        generationInProgress: false,
      },
    })
  })
}

export const fetchImage = createAsyncThunk('app/fetchImage', async (task: Task, { dispatch }) => {
  if (task.image) return

  const response = await axios.post('/api/fetch-image', { topic: task.topic })

  if (response.data.error) {
    console.log('[ERROR] fetchImage:', response.data.error)
    return
  }

  dispatch({
    type: 'app/updateTask',
    payload: {
      id: task.id,
      image: response.data,
    },
  })
})

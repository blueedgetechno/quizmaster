// import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { Question, Task, TaskDifficultyLevels, TaskState } from '@/types'

const validateQuestion = (x: Question) => {
  if (!x) return false
  if (!x.question || !x.question.length) return false

  if (!x.choices || !x.choices.length) return false
  if (!x.choices.every((x) => x && x.length)) return false

  if (!x.correctResponse) return false
  if (x.correctResponse < 0 || x.correctResponse >= x.choices.length) return false

  return true
}

export const createTask = async (task: Partial<Task>) => {
  const res = await axios.post('/api/create-quiz', task)

  const quesData = (res.data as Question[]).filter((x) => validateQuestion(x))

  if (quesData.length === 0) throw new Error('No questions')

  return {
    id: Math.floor(Math.random() * 1e5),
    topic: task.topic || 'Untitled Task',

    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),

    questions: quesData.map((q: Question) => ({
      ...q,
      explanation: q.explanation || '',
      userResponse: null,
      isCorrect: null,
    })),

    resumeIndex: 0,

    grade: task.grade || '',
    state: TaskState.IDLE,
    difficulty: task.difficulty || TaskDifficultyLevels.MEDIUM,
  } as Task
}

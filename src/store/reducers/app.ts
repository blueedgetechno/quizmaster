import { createSlice } from '@reduxjs/toolkit'

import { Grade, Question, Task, TaskState } from '@/types'

const initialState = {
  username: 'user_' + Math.floor(Math.random() * 1e5),
  model: 'gemini',
  education: {
    grade: '' as Grade,
  },
  tasks: [] as Task[],
}

const _Slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    updateChoiceOfModel: (state, action: { payload: string }) => {
      state.model = action.payload
    },
    addTask: (state, action: { payload: Task }) => {
      state.education.grade = action.payload.grade

      const new_tasks = state.tasks.filter((x) => x.id !== action.payload.id)
      new_tasks.push({ ...action.payload })

      state.tasks = [...new_tasks]
    },
    deleteTask: (state, action: { payload: number }) => {
      state.tasks = state.tasks.filter((x) => x.id !== action.payload)
    },
    updateTask: (
      state,
      action: {
        payload: {
          id: number
          questions: Question[]
          generationInProgress: boolean
        }
      }
    ) => {
      const index = state.tasks.findIndex((x) => x.id === action.payload?.id)
      if (index === -1) return

      const task = { ...state.tasks[index] }

      if (action.payload.questions !== undefined) {
        task.questions = [...task.questions.map((x) => ({ ...x })), ...action.payload.questions]
      }

      if (action.payload.generationInProgress !== undefined) {
        task.generationInProgress = action.payload.generationInProgress
      }

      task.lastEdited = new Date().toISOString()
      state.tasks[index] = { ...task }

      if (action.payload.generationInProgress === false && task.questions.length < 1) {
        state.tasks = state.tasks.filter((x) => x.id !== action.payload.id)
      }
    },
    startQuiz: (state, action: { payload: number }) => {
      const index = state.tasks.findIndex((x) => x.id === action.payload)
      if (index === -1) return

      const task = { ...state.tasks[index] }

      task.state = TaskState.ACTIVE
      task.resumeIndex = 0
      task.lastEdited = new Date().toISOString()

      state.tasks[index] = { ...task }
    },
    reStartQuiz: (state, action: { payload: number }) => {
      const index = state.tasks.findIndex((x) => x.id === action.payload)
      if (index === -1) return

      const task = { ...state.tasks[index] }

      task.state = TaskState.IDLE
      task.resumeIndex = 0

      task.questions = [...task.questions.map((x) => ({ ...x }))].map((x) => ({
        ...x,
        userResponse: null,
        isCorrect: null,
      }))

      task.lastEdited = new Date().toISOString()
      state.tasks[index] = { ...task }
    },
    answerQuestion: (state, action) => {
      const data = action.payload as {
        taskId: number
        questionIndex: number
        userResponse: number
      }

      if (!data) return

      const taskIndex = state.tasks.findIndex((x) => x.id === data.taskId)
      if (taskIndex === -1) return

      const task = { ...state.tasks[taskIndex] }
      task.questions = [...task.questions.map((x) => ({ ...x }))]

      const ques = { ...task.questions[data.questionIndex] }
      if (!ques) return

      ques.userResponse = data.userResponse
      ques.isCorrect = ques.userResponse === ques.correctResponse

      task.questions[data.questionIndex] = { ...ques }

      task.lastEdited = new Date().toISOString()
      state.tasks[taskIndex] = { ...task }
    },
    nextQuestion: (state, action: { payload: number }) => {
      const taskIndex = state.tasks.findIndex((x) => x.id === action.payload)
      if (taskIndex === -1) return

      const task = { ...state.tasks[taskIndex] }

      if (task.resumeIndex >= task.questions.length - 1) {
        task.state = TaskState.COMPLETED
      } else {
        task.resumeIndex = task.resumeIndex + 1
      }

      task.lastEdited = new Date().toISOString()
      state.tasks[taskIndex] = { ...task }
    },
  },
})

export default _Slice.reducer

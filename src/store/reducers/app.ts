import { createSlice } from '@reduxjs/toolkit'

import { Grade, Task, TaskState } from '@/types'

const initialState = {
  username: 'user_' + Math.floor(Math.random() * 1e5),
  education: {
    grade: '' as Grade,
  },
  tasks: [] as Task[],
}

const _Slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    addTask: (state, action: { payload: Task }) => {
      state.education.grade = action.payload.grade

      state.tasks.push(action.payload)
    },
    startQuiz: (state, action: { payload: number }) => {
      const index = state.tasks.findIndex((x) => x.id === action.payload)
      if (index === -1) return

      state.tasks[index].state = TaskState.ACTIVE
      state.tasks[index].resumeIndex = 0

      state.tasks[index].lastEdited = new Date().toISOString()
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

      const ques = state.tasks[taskIndex].questions[data.questionIndex]
      if (!ques) return

      ques.userResponse = data.userResponse
      ques.isCorrect = ques.userResponse === ques.correctResponse

      state.tasks[taskIndex].lastEdited = new Date().toISOString()
    },
    nextQuestion: (state, action: { payload: number }) => {
      const taskIndex = state.tasks.findIndex((x) => x.id === action.payload)
      if (taskIndex === -1) return

      const task = state.tasks[taskIndex]

      if (task.resumeIndex >= task.questions.length - 1) {
        task.state = TaskState.COMPLETED
      } else {
        task.resumeIndex = task.resumeIndex + 1
      }

      task.lastEdited = new Date().toISOString()
    },
  },
})

export default _Slice.reducer

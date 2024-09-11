import { createSlice } from '@reduxjs/toolkit'

import { Task } from '@/types'

const initialState = {
  username: 'user_' + Math.floor(Math.random() * 1e5),
  tasks: [] as Task[],
}

const _Slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload)
    },
  },
})

export default _Slice.reducer

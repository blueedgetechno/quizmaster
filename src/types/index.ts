export interface Question {
  question: string
  options: string[]
  explanation: string | null

  correctResponse: number
  userResponse: number | null
  isCorrect: boolean | null
}

export enum TaskState {
  IDLE = 'idle',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface Task {
  id: number
  title: string
  createdAt: string
  lastEdited: string

  questions: Question[]

  state: TaskState
}

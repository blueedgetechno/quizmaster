import { SchemaType } from '@google/generative-ai'

import { EducationLevels } from '@/consts'

export interface Question {
  question: string
  choices: string[]
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

export const TaskStateOrder = {
  [TaskState.ACTIVE]: 0,
  [TaskState.IDLE]: 1,
  [TaskState.COMPLETED]: 2,
}

export const TaskStateText = {
  [TaskState.ACTIVE]: 'Paused',
  [TaskState.IDLE]: 'Yet to Start',
  [TaskState.COMPLETED]: 'Completed',
}

export enum TaskDifficultyLevels {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface Task {
  id: number
  topic: string
  createdAt: string
  lastEdited: string

  questions: Question[]
  resumeIndex: number

  grade: Grade
  state: TaskState
  difficulty: TaskDifficultyLevels
}

export const QuestionResponse = {
  question: {
    type: SchemaType.STRING,
  },
  choices: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.STRING,
    },
  },
  correctResponse: {
    type: SchemaType.NUMBER,
  },
  explanation: {
    type: SchemaType.STRING,
  },
}

export type Grade = (typeof EducationLevels)[number]

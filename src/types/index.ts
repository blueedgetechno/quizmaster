import { SchemaType } from '@google/generative-ai'

import { EducationLevels } from '@/consts'

export interface Question {
  /**
   * The question to be asked, in string format
   */
  question: string
  /**
   * Choices for the question in the form of string array
   */
  choices: string[]
  /**
   * Explanation of the question's solution
   */
  explanation: string | null
  /**
   * 1-Index of the correct response in the choices array
   */
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

  intendedLength: number
  generationInProgress: boolean

  questions: Question[]
  resumeIndex: number

  grade: Grade
  state: TaskState
  difficulty: TaskDifficultyLevels
}

export interface InformalTask extends Partial<Task> {
  count?: number
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

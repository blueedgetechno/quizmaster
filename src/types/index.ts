import { ResponseSchema, SchemaType } from '@google/generative-ai'

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

  image?: {
    thumbnailUrl: string
    accentColor: string
  }
}

export interface InformalTask extends Partial<Task> {
  count?: number
}

export const QuestionResponseSchema: ResponseSchema = {
  type: SchemaType.ARRAY,
  description: 'List of questions with choices, correct response and explanation',
  items: {
    type: SchemaType.OBJECT,
    properties: {
      question: {
        type: SchemaType.STRING,
        description: 'Content of the question statement.',
        nullable: false,
      },
      choices: {
        type: SchemaType.ARRAY,
        description:
          'Array of the choices for the question. It can have either 4 choices or 2 choices (True or False).',
        items: {
          type: SchemaType.STRING,
          description: 'A choice element in form of string.',
          nullable: false,
        },
        nullable: false,
      },
      correctResponse: {
        type: SchemaType.NUMBER,
        description:
          'correct answer of the question in the 1-indexed number format. It is between 1 to 4 for 4 choices and 1 to 2 for 2 choices (True or False).',
        nullable: false,
      },
      explanation: {
        type: SchemaType.STRING,
        description: 'The correct explanation of the answer for the question.',
        nullable: true,
      },
    },
    required: ['question', 'choices', 'correctResponse'],
  },
}

export type CheckResponse = {
  correctResponseNumber?: number
  isMissingChoice?: boolean
  correctAnswer: string
}

export const QuestionResponseCheckSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    correctResponseNumber: {
      type: SchemaType.NUMBER,
      description: 'The correct response number according to the explanation.',
      nullable: false,
    },
    isMissingChoice: {
      type: SchemaType.BOOLEAN,
      description: 'Whether the correct answer, according to the explanation, is missing in the choices array.',
      nullable: true,
    },
    correctAnswer: {
      type: SchemaType.STRING,
      description: 'The correct answer choice according to the explanation.',
      nullable: false,
    },
  },
  required: ['correctAnswer'],
}

export type Grade = (typeof EducationLevels)[number]

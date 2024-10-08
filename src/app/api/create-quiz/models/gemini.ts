import { GenerationConfig, GoogleGenerativeAI } from '@google/generative-ai'

import { QuestionResponseSchema } from '@/types'

import { extractObjectItems, formatResponse } from '../utils'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: QuestionResponseSchema,
}

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  generationConfig: generationConfig,
  systemInstruction: {
    role: 'system',
    parts: [
      {
        text: 'A quiz generator model which generates given number of questions in json, with multiple choices, sometimes 4 options and sometimes 2 options (true or false) and then return option number of correct answer (1 - 4 or 1 - 2) with explanation.',
      },
      {
        text: `
          Example:
          Input: Topic: Algebra, Count: 2, Grade: Middle School, Difficulty: Easy

          Output:
          [
            {
              "question": "What is the value of x in the equation 2x + 3 = 9?"
              "choices": [2, 3, 4, 6],
              "correctResponse": 2,
              "explanation": "When 2x + 3 = 9, subtract 3 from both sides to get 2x = 6. Then divide by 2 to get x = 3."
            },
            {
              "question": "Which of the following is neither a rational number nor an interger?"
              "choices": ["3x + 2 = 11", "4x - 3 = 10", "14 - 7x = 4 + 3x", "8x + 11 = x + 3"],
              "correctResponse": 4,
              "explanation": "The equation\n8x + 11 = x + 3\n7x = -8\nx = -8/7\nis not a rational number or an integer."
            }
          ]
        `,
      },
    ],
  },
})

export async function* callbackModel(prompt: string, count: number) {
  if (count < 1) return

  const result = await model.generateContentStream(prompt)

  let dataFeed = ''
  let lengthSoFar = 0

  for await (const chunk of result.stream) {
    dataFeed += chunk.text() || ''
    const objectItems = extractObjectItems(dataFeed)

    if (objectItems.length <= lengthSoFar) continue

    yield await formatResponse('[' + objectItems.slice(lengthSoFar).join(',') + ']')

    lengthSoFar = objectItems.length
  }
}

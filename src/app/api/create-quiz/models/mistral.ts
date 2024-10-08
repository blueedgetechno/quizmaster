import { HfInference } from '@huggingface/inference'
import type { ChatCompletionInputMessage } from '@huggingface/tasks'

import { formatResponse } from '../utils'

const inference = new HfInference(process.env.HUGGING_FACE_API_KEY)

const context = [
  {
    role: 'system',
    content: `
        A quiz generator model which generates given number of questions in json, with multiple choices, sometimes 4 options and sometimes 2 options (true or false) and then return option number of correct answer (1 - 4 or 1 - 2) with explanation.
        
        THE OUTPUT SHOULD BE ONLY JSON.

        RETURN ONLY QUESTION AT A TIME.
      `,
  },
  {
    role: 'user',
    content: 'Topic: Algebra, Count: 2, Grade: Middle School, Difficulty: Easy',
  },
  {
    role: 'assistant',
    content: '{message: "I understand the topic and difficulty level"}',
  },
  {
    role: 'user',
    content: 'QuestionNumber: 1',
  },
  {
    role: 'assistant',
    content: JSON.stringify({
      question: 'What is the value of x in the equation 2x + 3 = 9?',
      choices: [2, 3, 4, 5],
      correctResponse: 2,
      explanation: 'When 2x + 3 = 9, subtract 3 from both sides to get 2x = 6. Then divide by 2 to get x = 3.',
    }),
  },
  {
    role: 'user',
    content: 'QuestionNumber: 2',
  },
  {
    role: 'assistant',
    content: JSON.stringify({
      question: 'Which of the following is neither a rational number nor an interger?',
      choices: ['3x + 2 = 11', '4x - 3 = 10', '14 - 7x = 4 + 3x', '8x + 11 = x + 3'],
      correctResponse: 4,
      explanation: 'The equation\n8x + 11 = x + 3\n7x = -8\nx = -8/7\nis not a rational number or an integer.',
    }),
  },
] as ChatCompletionInputMessage[]

export async function* callbackModel(prompt: string, count: number) {
  if (count < 1) return

  const chatArray: ChatCompletionInputMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
    {
      role: 'assistant',
      content: '{message: "I understand the topic and difficulty level"}',
    },
  ]

  for (let i = 1; i <= count; i++) {
    chatArray.push({
      role: 'user',
      content: 'QuestionNumber: ' + i,
    })

    const result = await inference.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [...context, ...chatArray],
      max_tokens: 4096,
    })

    try {
      yield formatResponse('[' + result.choices[0].message.content! + ']')
    } catch {
      // no console
    }

    chatArray.push(result.choices[0].message)
  }
}

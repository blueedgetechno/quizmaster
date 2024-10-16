import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

import { mixChoices } from '../utils'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const QuestionsArray = z.array(
  z.object({
    question: z.string(),
    choices: z.array(z.string()),
    correctOption: z.string(),
    explanation: z.string(),
  })
)

const context = [
  {
    role: 'system',
    content:
      'A quiz generator model which generates given number of questions in json, with multiple choices, sometimes 4 options and sometimes 2 options (true or false) and then return option number of correct answer (1 - 4 or 1 - 2) with explanation.',
  },
  {
    role: 'system',
    content: `
          Example:
          Input: Topic: Algebra, Count: 3, Grade: Middle School, Difficulty: Easy

          Output:
          question: What is the value of x in the equation 2x + 3 = 9?
          choices: [2, 3, 4, 5]
          correctOption: option_2
          explanation: When 2x + 3 = 9, subtract 3 from both sides to get 2x = 6. Then divide by 2 to get x = 3.

          question: Which of the following is neither a rational number nor an interger?
          choices: ['3x + 2 = 11', '4x - 3 = 10', '14 - 7x = 4 + 3x', '8x + 11 = x + 3']
          correctOption: option_4
          explanation: The equation\n8x + 11 = x + 3\n7x = -8\nx = -8/7\nis not a rational number or an integer.
        `,
  },
] as Array<OpenAI.ChatCompletionSystemMessageParam>

interface ModelResponse {
  question: string
  choices: string[]
  correctOption: string
  explanation: string
}

export async function callbackModel(prompt: string) {
  const userPrompt = {
    role: 'user',
    content: prompt,
  } as OpenAI.ChatCompletionUserMessageParam

  const result = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [...context, userPrompt],
    response_format: zodResponseFormat(QuestionsArray, 'questions_array'),
  })

  const rawResponse: ModelResponse[] = result.choices[0].message.parsed || []

  if (!rawResponse.length) {
    throw new Error('Invalid response from model')
  }

  const questions = rawResponse.map((q) => {
    const rawChoices = q.choices

    const initialCorrectOption = Number(q['correctOption'].replace('option_', ''))

    const [choices, correctOption] = mixChoices(rawChoices, initialCorrectOption)

    return {
      question: q.question,
      choices: choices,
      correctResponse: correctOption,
      explanation: q.explanation,
    }
  })

  return questions
}

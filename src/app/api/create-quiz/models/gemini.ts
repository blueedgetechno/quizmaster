import { GenerationConfig, GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
}

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  generationConfig: generationConfig,
  systemInstruction: {
    role: 'user',
    parts: [
      {
        text: 'A quiz generator model which generates given number of questions in json, with multiple choices, sometimes 4 options and sometimes 2 options (true or false) and then return option number of correct answer (1 - 4 or 1 - 2) with explanation.',
      },
      {
        text: `
          Example:
          Input: Topic: Algebra, Count: 3, Grade: Middle School, Difficulty: Easy

          Output:
          # Question 1
          question: What is the value of x in the equation 2x + 3 = 9?
          options_count: 4
          option_1: 2
          option_2: 3
          option_3: 4
          option_4: 6
          correct_option: option_2
          explanation: When 2x + 3 = 9, subtract 3 from both sides to get 2x = 6. Then divide by 2 to get x = 3.

          # Question 2
          question: Which of the following is neither a rational number nor an interger?
          options_count: 4
          option_1: 3x + 2 = 11
          option_2: 4x - 3 = 10
          option_3: 14 - 7x = 4 + 3x
          option_4: 8x + 11 = x + 3
          correct_option: option_4
          explanation: The equation\n8x + 11 = x + 3\n7x = -8\nx = -8/7\nis not a rational number or an integer.
        `,
      },
    ],
  },
})

interface ModelResponse {
  question: string
  options_count: number
  option_1: string
  option_2: string
  option_3?: string
  option_4?: string
  correct_option: string

  explanation: string | null
}

const mixChoices = (choices: string[], correctOptionIndex: number) => {
  const tmpChoices = [...choices]
    .map((c, i) => [i + 1, c])
    .sort(() => Math.random() - 0.5)
    .sort(() => Math.random() - 0.5)
    .sort(() => Math.random() - 0.5)

  const newIndex = tmpChoices.findIndex(([i]) => i === correctOptionIndex) + 1

  const shuffledChoices = tmpChoices.map(([, c]) => c)

  return [shuffledChoices, newIndex]
}

export async function callbackModel(prompt: string) {
  const result = await model.generateContent(prompt)
  const rawResponse: ModelResponse[] = JSON.parse(result.response.text())

  if (!rawResponse.length) {
    throw new Error('Invalid response from model')
  }

  const questions = rawResponse.map((q) => {
    const rawChoices = Object.entries(q)
      .filter(([k]) => k.startsWith('option_'))
      .map(([, v]) => v)

    const initialCorrectOption = Number(q['correct_option'].replace('option_', ''))

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

import { Question } from '@/types'

import { doubleCheckMethod } from '../double-check/gemini'

type ModelResponse = Omit<Question, 'userResponse'>

export const mixChoices = (choices: string[], correctResponseIndex: number) => {
  const tmpChoices = [...choices]
    .map((c, i) => [i + 1, c])
    .sort(() => Math.random() - 0.5)
    .sort(() => Math.random() - 0.5)
    .sort(() => Math.random() - 0.5)

  const newIndex = tmpChoices.findIndex(([i]) => i === correctResponseIndex) + 1

  const shuffledChoices = tmpChoices.map(([, c]) => c)

  return [shuffledChoices, newIndex]
}

export const formatResponse = async (response: string) => {
  const rawParsedResponse: ModelResponse[] = JSON.parse(response)
  const rawResponse = await Promise.all(
    rawParsedResponse.map(async (q) => {
      try {
        const checkResponse = await doubleCheckMethod(JSON.stringify(q))

        const newChoices = [...q.choices]

        if (checkResponse.isMissingChoice) {
          newChoices[3] = checkResponse.correctAnswer

          return {
            ...q,
            choices: newChoices,
            correctResponse: 4,
          }
        }

        if (checkResponse.correctResponseNumber != null && checkResponse.correctResponseNumber != q.correctResponse) {
          newChoices[checkResponse.correctResponseNumber - 1] = checkResponse.correctAnswer

          return {
            ...q,
            choices: newChoices,
            correctResponse: checkResponse.correctResponseNumber,
          }
        }
      } catch (error) {
        // no console
      }

      return q
    })
  )

  if (!rawResponse.length) {
    throw new Error('Invalid response from model')
  }

  const questions = rawResponse.map((q) => {
    const rawChoices = q.choices

    const initialCorrectOption = Number(String(q['correctResponse']).replace('option_', ''))

    const [choices, correctOption] = mixChoices(rawChoices, initialCorrectOption)

    return {
      question: q.question,
      choices: choices as string[],
      correctResponse: correctOption as number,
      explanation: q.explanation,
    }
  })

  return JSON.stringify(questions)
}

export function extractObjectItems(jsonString: string) {
  // Regular expression to match object items within the array
  const regex = /\{[^}]+\}/g

  // Extract object items from the JSON string
  const objectItems = jsonString.match(regex)

  // Return the extracted object items or an empty array if none found
  return objectItems || []
}

export function isJSON(str: string) {
  try {
    return JSON.parse(str) && !!str
  } catch (e) {
    return false
  }
}

export const joinObject = (arg0: object) => {
  return Object.entries(arg0)
    .map((x) => {
      const [key, value] = x
      return key[0].toUpperCase() + key.slice(1) + ': ' + value
    })
    .join(', ')
}

export function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) controller.close()
      if (value) controller.enqueue(value)
    },
  })
}

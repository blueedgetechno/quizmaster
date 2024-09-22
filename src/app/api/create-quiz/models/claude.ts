import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const systemContext =
  'A quiz generator model which generates given number of questions in json, with multiple choices, sometimes 4 options and sometimes 2 options (true or false) and then return option number of correct answer (1 - 4 or 1 - 2) with explanation.'

const toolsUsed = [
  {
    name: 'questions_array_generator',
    description: 'Array of quiz questions generator in json format, based on user input prompt.',
    input_schema: {
      type: 'object',
      properties: {
        questions_list: {
          type: 'array',
          description: 'Array of all the generated items.',
          items: {
            type: 'object',
            description: 'Single question item with properties being questions, choices, correct_choice, explanation.',
            properties: {
              question: {
                type: 'string',
                description: 'Content of the question statement.',
              },
              choices: {
                type: 'array',
                description:
                  'Array of the choices presented for the question. It can have either 4 choices or 2 choices (True or False).',
                items: {
                  type: 'string',
                  description: 'A choice element in form of string.',
                },
              },
              correct_choice: {
                type: 'string',
                description:
                  'correct answer of the question in the format of, choice_1, choice_2, choice_3 or choice_4. It is either choice_1 or choice_2 when only 2 choices are given in choices array.',
              },
              explanation: {
                type: 'string',
                description: 'The correct explanation of the answer for the question.',
              },
            },
          },
        },
      },
      required: ['questions_list'],
    },
  },
]

interface ModelResponse {
  question: string
  choices: string[]
  correct_choice: string
  explanation: string
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
  const result = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    system: systemContext,
    tools: toolsUsed,
    tool_choice: { type: 'tool', name: 'questions_array_generator' },
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  return result

  const rawResponse: ModelResponse[] = result.choices[0].message.parsed

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

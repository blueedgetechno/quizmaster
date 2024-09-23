import { HfInference } from '@huggingface/inference'

import { extractObjectItems, formatResponse } from '../utils'

const inference = new HfInference(process.env.HUGGING_FACE_API_KEY)

const context = [
  {
    role: 'system',
    content: `
        A quiz generator model which generates given number of questions in json, with multiple choices, sometimes 4 options and sometimes 2 options (true or false) and then return option number of correct answer (1 - 4 or 1 - 2) with explanation.
        
        THE OUTPUT SHOULD BE ONLY JSON.

        Example:
          Input: Topic: Algebra, Count: 3, Grade: Middle School, Difficulty: Easy

          Output:
            [
              {
                "question": "What is the value of x in the equation 2x + 3 = 9?",
                "choices": [2, 3, 4, 5],
                "correctResponse": "option_2",
                "explanation": "When 2x + 3 = 9, subtract 3 from both sides to get 2x = 6. Then divide by 2 to get x = 3."
              },
              {
                "question": "Which of the following is neither a rational number nor an interger?",
                "choices": ["3x + 2 = 11", "4x - 3 = 10", "14 - 7x = 4 + 3x", "8x + 11 = x + 3"],
                "correctResponse": "option_4",
                "explanation": "The equation\n8x + 11 = x + 3\n7x = -8\nx = -8/7\nis not a rational number or an integer."
              }
            ]          
        `,
  },
]

export async function* callbackModel(prompt: string) {
  const result = inference.chatCompletionStream({
    model: 'mistralai/Mistral-7B-Instruct-v0.3',
    messages: [...context, { role: 'user', content: prompt }],
    max_tokens: 4096,
  })

  let dataFeed = ''
  let lengthSoFar = 0

  for await (const chunk of result) {
    dataFeed += chunk.choices[0]?.delta?.content || ''
    const objectItems = extractObjectItems(dataFeed)

    if (objectItems.length <= lengthSoFar) continue

    yield formatResponse('[' + objectItems.slice(lengthSoFar).join(',') + ']')

    lengthSoFar = objectItems.length
  }
}

import { GenerationConfig, GoogleGenerativeAI } from '@google/generative-ai'

import { CheckResponse, QuestionResponseCheckSchema } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
  responseMimeType: 'application/json',
  responseSchema: QuestionResponseCheckSchema,
}

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-002',
  generationConfig: generationConfig,
  systemInstruction: {
    role: 'system',
    parts: [
      {
        text: 'This model double checks whether the questions are generated correctly. It checks that the "explanation" is in sync with the "correctResponse" of "choices", or whether a correct choice is present or not. It returns the correct answer incase of missing choice according to the explanation.',
      },
      {
        text: `
          Input: {
            "question": "Who holds the record for scoring the most runs in a single IPL season?"
            "choices": ["Chris Gayle", "AB de Villiers", "Virat Kohli", "Suresh Raina"],
            "correctResponse": 4,
            "explanation": "Virat Kohli achieved this feat in 2016 by amassing 973 runs."
          }

          Output: {
            "correctResponseNumber": 3,
            "correctAnswer": "Virat Kohli",
          }

          Input: {
            "question": "Which franchise is known for its consistent performance and is often referred to as 'Thala' by fans?"
            "choices": ["Kolkata Knight Riders", "Chennai Super Kings", "Rajasthan Royals", "Mumbai Indians"],
            "correctResponse": 2,
            "explanation": "Chennai Super Kings, led by MS Dhoni (nicknamed 'Thala'), is known for its consistency and loyal fanbase."
          }

          Output: {
            "correctResponseNumber": 2,
            "correctAnswer": "Chennai Super Kings",
          }

          Input: {
            "question": "Who succeeded Akbar as the emperor of the Mughal Empire?"
            "choices": ["Aurangzeb", "Salim", "Dara Shikoh", "Shah Jahan"],
            "correctResponse": 1,
            "explanation": "Jahangir was Akbar's third son and succeeded him as emperor."
          }

          Output: {
            "isMissingChoice": true,
            "correctAnswer": "Jahangir",
          }
        `,
      },
    ],
  },
})

export async function doubleCheckMethod(prompt: string) {
  const result = await model.generateContent(prompt)

  const responseData: CheckResponse = JSON.parse(result.response.text())

  return responseData
}

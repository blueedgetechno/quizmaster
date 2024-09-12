import { GenerationConfig, GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

import { QuestionResponse } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: QuestionResponse,
    },
  },
}

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  generationConfig: generationConfig,
  systemInstruction:
    'A quiz generator model which generates given number of questions in json, with multiple choices, sometimes 4 options and sometimes 2 options (true or false).',
})

export async function callbackModel(prompt: string) {
  const result = await model.generateContent(prompt)
  return result.response.text()
}

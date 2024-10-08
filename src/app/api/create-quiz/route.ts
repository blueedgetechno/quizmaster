import { type NextRequest } from 'next/server'

import { InformalTask, Question } from '@/types'

import { doubleCheckMethod } from './double-check/gemini'
import { callbackModel as geminiCallback } from './models/gemini'
import { callbackModel as mistralCallback } from './models/mistral'
import { iteratorToStream, joinObject } from './utils'

export async function GET() {
  return Response.json({ status: 200, message: '(⌐■_■)' })
}

export async function POST(req: NextRequest) {
  const data: InformalTask & { model?: string } = await req.json()

  if (!data.topic || !data.count || !data.grade || !data.difficulty) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const callbackModel = data.model === 'mistral' ? mistralCallback : geminiCallback

  try {
    const iterator = callbackModel(
      joinObject({
        topic: data.topic,
        count: data.count,
        grade: data.grade,
        difficulty: data.difficulty,
      }),
      data.count
    )

    return new Response(iteratorToStream(iterator))
  } catch (error) {
    console.log(error)

    return Response.json({ error: error }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const data: Question = await req.json()

  if (!data.question || !data.choices || !data.correctResponse || !data.explanation) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const checkResponse = await doubleCheckMethod(JSON.stringify(data))

    return Response.json(checkResponse)
  } catch (error) {
    console.log(error)

    return Response.json({ error: error }, { status: 500 })
  }
}

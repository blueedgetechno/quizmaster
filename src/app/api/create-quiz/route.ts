import { type NextRequest } from 'next/server'

import { InformalTask } from '@/types'

import { callbackModel } from './models/mistral'
import { iteratorToStream, joinObject } from './utils'

export async function GET() {
  return Response.json({ status: 200, message: '(⌐■_■)' })
}

export async function POST(req: NextRequest) {
  const data: InformalTask = await req.json()

  if (!data.topic || !data.count || !data.grade || !data.difficulty) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const iterator = callbackModel(
      joinObject({
        topic: data.topic,
        count: data.count,
        grade: data.grade,
        difficulty: data.difficulty,
      })
    )

    return new Response(iteratorToStream(iterator))
  } catch (error) {
    console.log(error)

    return Response.json({ error: error }, { status: 500 })
  }
}

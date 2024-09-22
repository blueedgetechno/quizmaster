import { type NextRequest } from 'next/server'

import { Task } from '@/types'

import { callbackModel } from './models/claude'

const joinObject = (arg0: object) => {
  return Object.entries(arg0)
    .map((x) => {
      const [key, value] = x
      return key[0].toUpperCase() + key.slice(1) + ': ' + value
    })
    .join(', ')
}

export async function GET() {
  return Response.json({ status: 200, message: '(⌐■_■)' })
}

export async function POST(req: NextRequest) {
  const data: Partial<Task & { count: number }> = await req.json()

  try {
    const responseData = await callbackModel(
      joinObject({
        topic: data.topic,
        count: data.count,
        grade: data.grade,
        difficulty: data.difficulty,
      })
    )

    return Response.json(responseData)
  } catch (error) {
    console.log(error)

    return Response.json({ error: error }, { status: 500 })
  }
}

import { type NextRequest } from 'next/server'

import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.bing.microsoft.com/v7.0/images',
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY,
  },
})

export async function POST(req: NextRequest) {
  const data: { topic?: string } = await req.json()

  if (!data.topic) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const response = await axiosInstance.get('/search', {
      params: {
        q: data.topic,
        count: 5,
        aspect: 'wide',
        size: 'Medium',
      },
    })

    const length = response.data.value.length

    const result = response.data.value[Math.floor(Math.random() * length)]

    if (!result) throw new Error('No image found')

    return Response.json({
      thumbnailUrl: result.thumbnailUrl,
      accentColor: result.accentColor,
    })
  } catch (error) {
    return Response.json({ error: error }, { status: 500 })
  }
}

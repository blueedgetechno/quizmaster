import {type NextRequest} from 'next/server'

export async function GET(req: NextRequest) {
  return Response.json({ name: req.nextUrl.searchParams.get('name') || 'John Doe' })
}
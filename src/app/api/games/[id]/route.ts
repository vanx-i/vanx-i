import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const games = await sql`SELECT * FROM games WHERE id = ${id}`
    if (games.length === 0) return NextResponse.json(null, { status: 404 })
    return NextResponse.json(games[0])
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}
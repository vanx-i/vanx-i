import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json([])
    }

    const games = await sql`
      SELECT 
        g.id,
        g.name,
        g.category,
        g.platforms,
        g.release_date,
        g.cover_url,
        g.hypes
      FROM games g
      JOIN user_games ug ON ug.game_id = g.id
      JOIN users u ON u.id = ug.user_id
      WHERE u.clerk_id = ${userId}
        AND ug.status = 'interested'
      ORDER BY g.release_date ASC
    `

    return NextResponse.json(games)
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
    return NextResponse.json([])
  }
}
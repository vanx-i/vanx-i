import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  try {
    const users = await sql`
      SELECT id, name, username, bio, public_profile
      FROM users
      WHERE username = ${username}
        AND public_profile = true
    `

    if (users.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const user = users[0]

    const games = await sql`
      SELECT 
        g.id, g.name, g.category, g.platforms,
        g.release_date, g.cover_url, g.hypes, g.interest_count
      FROM games g
      JOIN user_games ug ON ug.game_id = g.id
      WHERE ug.user_id = ${user.id}
        AND ug.status = 'interested'
      ORDER BY g.release_date ASC
    `

    return NextResponse.json({ user, games })
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
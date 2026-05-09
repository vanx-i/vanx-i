import { sql } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  if (userId !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const [users, games, topGames, recentUsers] = await Promise.all([
    sql`SELECT COUNT(*) as total FROM users`,
    sql`SELECT COUNT(*) as total FROM games`,
    sql`
      SELECT name, interest_count, release_date, cover_url
      FROM games 
      WHERE interest_count > 0
      ORDER BY interest_count DESC 
      LIMIT 10
    `,
    sql`
      SELECT name, email, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `
  ])

  return NextResponse.json({
    totalUsers: users[0].total,
    totalGames: games[0].total,
    topGames,
    recentUsers
  })
}
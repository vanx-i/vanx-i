import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const games = await sql`
      SELECT 
        id, name, category, platforms, release_date,
        cover_url, hypes, interest_count
      FROM games
      WHERE DATE(release_date) >= CURRENT_DATE
      ORDER BY interest_count DESC, hypes DESC
      LIMIT 5
    `
    return NextResponse.json(games, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    })
  } catch (error) {
    console.error('Error obteniendo top juegos:', error)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
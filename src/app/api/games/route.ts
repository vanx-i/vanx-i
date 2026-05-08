import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const games = await sql`
      SELECT 
        id,
        name,
        category,
        platforms,
        release_date,
        cover_url,
        summary,
        hypes,
        follows,
        rating,
        rating_count
      FROM games
      WHERE release_date >= CURRENT_DATE
      ORDER BY release_date ASC, hypes DESC, follows DESC
    `
    return NextResponse.json(games)
  } catch (error) {
    console.error('Error obteniendo juegos:', error)
    return NextResponse.json({ error: 'Error obteniendo juegos' }, { status: 500 })
  }
}
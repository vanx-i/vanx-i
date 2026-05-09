import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const games = await sql`
      SELECT 
        id, name, category, platforms, release_date,
        cover_url, summary, hypes, follows, rating, rating_count
      FROM games
      WHERE DATE(release_date) >= CURRENT_DATE - INTERVAL '30 days'
        AND DATE(release_date) < CURRENT_DATE
      ORDER BY release_date DESC, hypes DESC
    `
    return NextResponse.json(games, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    })
  } catch (error) {
    console.error('Error obteniendo juegos recientes:', error)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}